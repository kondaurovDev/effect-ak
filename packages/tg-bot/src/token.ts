import { Brand, Context } from "effect";
import { Schema as S } from "@effect/schema"

export type BotTokenValue =
  string & Brand.Brand<"TgBot.BotTokenValue">

export const BotTokenValue =
  S.NonEmptyString.pipe(S.brand("TgBotToken"))

export const BotToken =
  Context.GenericTag<BotTokenValue>("TgBot.BotToken");
