import { pipe, Effect } from "effect";
import { Schema as S } from "@effect/schema";
import * as Shared from "@efkit/shared";

import * as ChatCompletion from "../completion";
import { CompletionError } from "../completion/error";
import { CompletionService } from "./service";
import { ChatCompletionRequest } from "./request";

export type UserMessage = typeof UserMessage.Type
export const UserMessage =
  S.NonEmptyString.pipe(S.brand("UserTextMessage"));

export const completeChat = (
  request: ChatCompletionRequest
) =>
  pipe(
    CompletionService,
    Effect.andThen(completeChat =>
      completeChat(request)
    ),
    Effect.andThen(_ => _.firstChoice),
    Effect.andThen(_ =>
      Effect.fromNullable(_.message.content)
    )
  );

export const completeFunctionCall = <O>(
  request: ChatCompletionRequest,
  resultSchema: S.Schema<O, O>,
) =>
  pipe(
    ChatCompletion.CompletionService,
    Effect.andThen((completeChat) =>
      pipe(
        completeChat(request),
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
    )
  )
