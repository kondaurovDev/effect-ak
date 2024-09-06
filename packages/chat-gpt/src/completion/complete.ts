import { pipe, Effect } from "effect";
import { Schema as S } from "@effect/schema";
import * as Shared from "@efkit/shared";

import { CompletionError } from "../completion/error.js";
import { Completion, CompletionLive } from "./service.js";
import { ChatCompletionRequest } from "./request.js";

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
        Effect.andThen(_ => pipe(
          Shared.parseJson(_),
          Effect.mapError(() =>
            new CompletionError({ errorCode: "FunctionCallError" })
          )
        )),
        Effect.andThen(S.validate(resultSchema))
      )
    ),
    Effect.provide(CompletionLive)
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
        Effect.andThen(_ =>
          pipe(
            Shared.parseJson(_),
            Effect.mapError(() =>
              new CompletionError({ errorCode: "FunctionCallError" })
            )
          )),
        Effect.andThen(S.validate(resultSchema))
      )
    ),
    Effect.provide(CompletionLive)
  )
