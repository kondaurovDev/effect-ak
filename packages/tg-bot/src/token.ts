import { Brand, Context, Redacted } from "effect";

export type TgBotTokenValue = Redacted.Redacted<string> & Brand.Brand<"TgBot.TokenValue">
export const TgBotTokenValue = Brand.nominal<TgBotTokenValue>()

export const TgBotToken = Context.GenericTag<TgBotTokenValue>("TgBot.BotToken");
