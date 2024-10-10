import { Brand, Context, Redacted } from "effect";

export type TgBotToken = Brand.Branded<Redacted.Redacted<string>, "TgBotToken">;
export const TgBotToken = Brand.nominal<TgBotToken>();

export class TgBotTokenProvider
  extends Context.Tag("TgBot.TgBotTokenProvider")<TgBotTokenProvider, TgBotToken>() {};
