import * as S from "effect/Schema";
import { Config, Context, Effect, pipe, Redacted } from "effect";

export type TgBotToken = typeof TgBotToken.Type;
export const TgBotToken = S.NonEmptyString.pipe(S.Redacted, S.brand("TgBotToken"));

export class TgBotTokenProvider
  extends Context.Tag("TgBot.TgBotTokenProvider")<TgBotTokenProvider, TgBotToken>() {

    static fromEnv = 
      pipe(
        Config.nonEmptyString("TG_BOT_TOKEN"),
        Effect.andThen(Redacted.make),
        Effect.andThen(TgBotToken.make),
        Effect.andThen(TgBotTokenProvider.of)
      );

  };
