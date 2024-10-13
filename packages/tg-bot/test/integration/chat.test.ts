import { describe, expect, it } from "vitest";
import { Effect, Exit, Logger, LogLevel, pipe } from "effect"

import { ChatId, MessageEffectIdCodes, TgChatService } from "../../src/module/chat/index";
import { testEnv } from "./live";

describe("integration test", () => {

  it("send message", async () => {

    const actual = 
      await pipe(
        Effect.sleep("3 seconds"),
        Effect.andThen(() => 
          Effect.andThen(
            TgChatService, _ =>
              _.sendMessage({
                chat_id: ChatId.make(270501423),
                text: "hey",
                message_effect_id: MessageEffectIdCodes["🎉"]
              })
          )
        ),
        Effect.provide([ testEnv, TgChatService.Default ]),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.runPromiseExit
      )

    expect(actual).toEqual(Exit.succeed);
    
  })

})
