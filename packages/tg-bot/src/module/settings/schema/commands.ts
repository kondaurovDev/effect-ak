import * as S from "effect/Schema";

import { BotCommand, CommandScope } from "./bot-command.js";

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
