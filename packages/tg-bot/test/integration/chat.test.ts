import { describe, expect, it } from "vitest";
import { Effect, Exit, Logger, LogLevel, pipe } from "effect"

import { ChatId, FileWithContent } from "../../src/module/chat/index";
import { testEnv } from "./live";
import { TgBotService } from "../../src/public";

describe("chat service integration test", () => {

  it("send message", async () => {

    const actual =
      await pipe(
        Effect.sleep("3 seconds"),
        Effect.andThen(() => 
          Effect.andThen(
            TgBotService, _ =>
              _.chat.sendMessage({
                chat_id: ChatId.make(270501423),
                text: "hey again",
                message_effect_id: "❤️"
              })
          )
        ),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.provide([ testEnv ]),
        Effect.runPromiseExit
      );

    expect(actual).toEqual(Exit.succeed);
    
  });

  it("send text file", async () => {

    const actual = 
      await Effect.gen(function* () {

        const service = yield* TgBotService;

        yield* Effect.sleep("3 seconds");

        yield* service.chat.sendDocument({
          chat_id: ChatId.make(270501423),
          document: 
            FileWithContent.make({
              content: Buffer.from("Hello!"),
              fileName: "hey.txt"
            }),
          message_effect_id: "❤️",
          caption: "some code"
        }).effect

      }).pipe(
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.provide([ testEnv ]),
        Effect.runPromiseExit
      );

    expect(actual).toEqual(Exit.succeed);
    
  });

  it("send dice", async () => {

    const actual = 
      await Effect.gen(function* () {

        const service = yield* TgBotService;

        yield* Effect.sleep("3 seconds");

        yield* service.chat.sendDice({
          chat_id: ChatId.make(270501423),
          message_effect_id: "❤️",
          emoji: "🎯"
        }).effect

      }).pipe(
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.provide([ testEnv ]),
        Effect.runPromiseExit
      );

    expect(actual).toEqual(Exit.succeed);
    
  });

})
