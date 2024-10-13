import { Schema as S } from "@effect/schema"

import { BotCommand, CommandScope } from "./bot-command.js";
import { UpdateEventType } from "../../chat/schema/origin-update-event.js";

export const SetBotNameCommand =
  S.Struct({
    name: S.String,
    language_code: S.UndefinedOr(S.String)
  });

  export const SetBotCommandsCommand = 
  S.Struct({
    commands: S.Array(BotCommand),
    scope: S.suspend(() => CommandScope),
    language_code: S.UndefinedOr(S.String)
  });

  export const GetBotCommandsCommand = 
  S.Struct({
    scope: S.UndefinedOr(S.suspend(() => CommandScope)),
    language_code: S.UndefinedOr(S.NonEmptyString)
  });

  export const SetWebhookCommand = 
  S.Struct({
    url: S.NonEmptyString.pipe(S.pattern(/^https:\/\/.*/)),
    allow_updates: S.UndefinedOr(S.Array(UpdateEventType)),
    drop_pending_updates: S.UndefinedOr(S.Boolean),
    secret_token: S.NonEmptyString.pipe(S.minLength(3))
  });
