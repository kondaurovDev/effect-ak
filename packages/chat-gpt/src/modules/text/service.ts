import { Effect, pipe } from "effect";
import { Schema as S } from "@effect/schema"

import { CompletionEndpoint } from "../../api/index.js";
import { CompletionError } from "./error.js";
import { ChatCompletionRequest, OneOfRequest } from "./schema/request.js";
import { MissingInputFieldsError } from "./schema/error.js";

export class TextService
  extends Effect.Service<TextService>()("TextService", {

    effect:
      Effect.gen(function* () {

        const completionEndpoint = yield* CompletionEndpoint;

        const complete = (
          request: OneOfRequest
        ) =>
          pipe(
            completionEndpoint.completeChat(request),
            Effect.andThen(_ => _.firstChoice),
            Effect.andThen(_ =>
              Effect.fromNullable(_.message.content)
            )
          )

        const completeFunctionCall = <O>(
          request: ChatCompletionRequest, 
          schema: S.Schema<O>
        ) =>
          pipe(
            completionEndpoint.completeChat(request),
            Effect.andThen(_ => _.firstChoice),
            Effect.andThen(_ => _.functionArgumets),
            Effect.andThen(S.decode(S.parseJson(schema)))
          )

        const completeStructured = <O>(
          request: ChatCompletionRequest, 
          resultSchema: S.Schema<O>
        ) =>
          pipe(
            completionEndpoint.completeChat(request),
            Effect.andThen(_ => _.firstChoice),
            Effect.andThen(_ => _.message.content),
            Effect.filterOrFail(_ => _ != null, () => new CompletionError({ errorCode: "NoContent" })),
            Effect.andThen(response =>
              pipe(
                S.decode(S.parseJson(S.Struct({ result: S.Unknown })))(response),
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

        return {
          complete, completeFunctionCall, completeStructured
        } as const;

      }),

      dependencies: [
        CompletionEndpoint.Default
      ]


  }) {}