import { describe, expect, it } from "vitest";
import { Effect, Exit, Logger, LogLevel, pipe } from "effect"

import { ChatId, FileWithContent } from "../../src/module/chat/index.js";
import { testEnv } from "./live";
import { TgBotService } from "../../src/public";

describe("chat service integration test", () => {

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

})
