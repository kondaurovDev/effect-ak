import { Brand, Context } from "effect";

export type TgBotTokenValue = string & Brand.Brand<"TgBot.TokenValue">
export const TgBotTokenValue = Brand.nominal<TgBotTokenValue>()

export const TgBotToken = Context.GenericTag<TgBotTokenValue>("TgBot.BotToken");
