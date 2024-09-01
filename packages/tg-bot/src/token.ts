import { Context, Redacted } from "effect";

export class TgBotToken
  extends Context.Tag("TgBot.BotToken")<TgBotToken, Redacted.Redacted<string>>() {};
