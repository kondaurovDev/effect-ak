import { describe, it, expect } from "vitest";
import { pipe, Effect } from "effect"
import { LogLevelConfigFromEnvLive} from "@efkit/shared"

import { ChatCompletionRequest, CompletionServiceLive } from "../src/completion";
import { completeChat } from "../src/completion/complete";
import { GptTokenFromEnvLive } from "../src";

describe("chat completion test suite", () => {

  it("complete, case 1", async () => {

    const actual = 
      await pipe(
        completeChat(new ChatCompletionRequest({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "you are limited to use only one word for answer" },
            { role: "user", content: "what's programming language stands for js?" }
          ]
        })),
        Effect.provide(LogLevelConfigFromEnvLive),
        Effect.provide(CompletionServiceLive),
        Effect.provide(GptTokenFromEnvLive),
        Effect.runPromise
      );

    expect(actual.toLowerCase()).toEqual("javascript")

  })

})