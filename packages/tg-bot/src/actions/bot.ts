import { DateTime, Effect, pipe } from "effect"
import { Schema as S } from "@effect/schema"

import { TgRestClient } from "../client/tag.js"
import { UpdateEventType, User } from "../domain/index.js";
import { BotCommand, CommandScope } from "../domain/bot-command.js";

export const getMe = () =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getMe",
        {},
        User
      )
    )
  )

export const SetBotNameInput =
  S.Struct({
    name: S.String,
    language_code: S.optional(S.String)
  });

export const setBotName = (
  input: typeof SetBotNameInput.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/sendMyName",
        input,
        S.Boolean
      )
    )
  )

export const SetBotCommandsInput = 
  S.Struct({
    commands: S.Array(BotCommand),
    scope: S.suspend(() => CommandScope),
    language_code: S.optional(S.String)
  });

export const setBotCommands = (
  input: typeof SetBotCommandsInput.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/setMyCommands",
        input,
        S.Boolean
      )
    )
  )

export const GetBotCommandsInput = 
  S.Struct({
    scope: S.optional(S.suspend(() => CommandScope)),
    language_code: S.optional(S.NonEmptyString)
  });

export const getBotCommands = (
  input: typeof GetBotCommandsInput.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getMyCommands",
        input,
        S.Array(BotCommand)
      )
    )
  )

export const getWebhook = () =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getWebhookInfo",
        {},
        S.Struct({
          url: S.String,
          pending_update_count: S.Number,
          last_error_date:
            S.transform(
              S.Number,
              S.DateTimeUtcFromSelf,
              {
                strict: true,
                decode: seconds => DateTime.unsafeMake(seconds * 1000),
                encode: dt => dt.epochMillis / 1000
              }
            ).pipe(
              S.optional
            )
        })
      )
    )
  )

export const SetWebhookInput = 
  S.Struct({
    url: S.NonEmptyString.pipe(S.pattern(/^https:\/\/.*/)),
    allow_updates: S.optional(S.Array(UpdateEventType)),
    drop_pending_updates: S.optional(S.Boolean),
    secret_token: S.NonEmptyString.pipe(S.minLength(3))
  });

export const setWebhook = (
  input: typeof SetWebhookInput.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/setWebhook",
        input,
        S.Boolean
      )
    )
  )
