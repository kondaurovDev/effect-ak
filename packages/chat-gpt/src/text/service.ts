import { Context, Effect, Layer, pipe } from "effect";
import { Schema as S } from "@effect/schema"

import { CompletionEndpoint } from "../api/completion-endpoint.js";
import { TokenProvider } from "../api/token.js";
import { CompletionError } from "./error.js";
import { ChatCompletionRequest, OneOfRequest } from "./schema/request.js";
import { MissingInputFieldsError } from "./schema/error.js";

export type TextServiceInterface = {
  complete(_: OneOfRequest): Effect.Effect<string, unknown, TokenProvider>
  completeStructured<O>(_: ChatCompletionRequest, __: S.Schema<O>,): Effect.Effect<O, unknown, TokenProvider>
  completeFunctionCall<O>(_: ChatCompletionRequest, __: S.Schema<O>,): Effect.Effect<O, unknown, TokenProvider>
}

export class TextService
  extends Context.Tag("TextService")<TextService, TextServiceInterface>() {

  static live =
    Layer.effect(
      TextService,
      pipe(
        Effect.Do,
        Effect.bind("endpoint", () => CompletionEndpoint),
        Effect.andThen(({ endpoint }) =>
          TextService.of({
            complete: request =>
              pipe(
                endpoint.executeRequest(request),
                Effect.andThen(_ => _.firstChoice),
                Effect.andThen(_ =>
                  Effect.fromNullable(_.message.content)
                )
              ),
            completeFunctionCall: (request, resultSchema) =>
              pipe(
                endpoint.executeRequest(request),
                Effect.andThen(_ => _.firstChoice),
                Effect.andThen(_ => _.functionArgumets),
                Effect.andThen(S.decode(S.parseJson(resultSchema)))
              ),
            completeStructured: (request, resultSchema) =>
              pipe(
                endpoint.executeRequest(request),
                Effect.andThen(_ => _.firstChoice),
                Effect.andThen(_ => _.message.content),
                Effect.filterOrFail(_ => _ != null, () => new CompletionError({ errorCode: "NoContent" })),
                Effect.andThen(response =>
                  pipe(
                    S.decode(S.parseJson(S.Struct({ result: S.Unknown })))(response),
                    Effect.tapError(error =>
                      Effect.logDebug(error)
                    ),
                    Effect.catchTag("ParseError", () =>
                      new CompletionError({ errorCode: "NoJsonResult" })
                    ),
                    Effect.andThen(result =>
                      pipe(
                        S.validate(MissingInputFieldsError)(result.result),
                        Effect.matchEffect({
                          onFailure: () => S.decodeUnknown(resultSchema)(result.result),
                          onSuccess: error =>
                            new CompletionError({
                              errorCode: "MissingRequiredFields", message: error.$$$error
                            })
                        })
                      )
                    )
                  ))
              )
          })
        )
      )
    ).pipe(
      Layer.provide(CompletionEndpoint.live)
    )

}