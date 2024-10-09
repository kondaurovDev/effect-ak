import { Context, Redacted } from "effect";

export class TgBotTokenProvider
  extends Context.Tag("TgBot.TgBotTokenProvider")<TgBotTokenProvider, Redacted.Redacted<string>>() {};
