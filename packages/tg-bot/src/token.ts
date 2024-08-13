import { Context } from "effect";
import { Schema as S } from "@effect/schema"

export const BotTokenValue =
  S.NonEmptyString.pipe(S.brand("TgBot.BotTokenValue"))

export class BotToken extends
  Context.Tag("TgBot.BotToken")<
    BotToken,
    {
      token: typeof BotTokenValue.Type
    }
  >() {}
