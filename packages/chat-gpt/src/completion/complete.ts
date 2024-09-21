import { pipe, Effect } from "effect";
import { Schema as S } from "@effect/schema";
import { parseJson } from "@efkit/shared/utils";

import { CompletionError } from "../completion/error.js";
import { Completion, CompletionLive } from "./service.js";
import { ChatCompletionRequest, MissingInputFieldsError } from "./request.js";

export type UserMessage = typeof UserMessage.Type
export const UserMessage =
  S.NonEmptyString.pipe(S.brand("UserTextMessage"));

export const completeChat = (
  request: ChatCompletionRequest
) =>
  pipe(
    Completion,
    Effect.andThen(({ complete }) =>
      complete(request)
    ),
    Effect.andThen(_ => _.firstChoice),
    Effect.andThen(_ =>
      Effect.fromNullable(_.message.content)
    ),
    Effect.provide(CompletionLive)
  );

export const completeFunctionCall = <O>(
  request: ChatCompletionRequest,
  resultSchema: S.Schema<O>,
) =>
  pipe(
    Completion,
    Effect.andThen(({ complete }) =>
      pipe(
        complete(request),
        Effect.andThen(_ => _.firstChoice),
        Effect.andThen(_ => _.functionArgumets),
        Effect.andThen(_ =>
          pipe(
            parseJson(_),
            Effect.mapError(() =>
              new CompletionError({ errorCode: "InvalidJson" })
            )
          )),
        Effect.andThen(S.validate(resultSchema))
      )
    )
  )

export const completeStructuredRequest = <O>(
  request: ChatCompletionRequest,
  resultSchema: S.Schema<O>,
) =>
  pipe(
    Completion,
    Effect.andThen(({ complete }) =>
      pipe(
        complete(request),
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
                  onFailure: () => S.validate(resultSchema)(result.result),
                  onSuccess: error =>
                    new CompletionError({
                      errorCode: "MissingRequiredFields", message: error.$$$error
                    })
                })
              )
            )
          ))
      )
    )
  )
