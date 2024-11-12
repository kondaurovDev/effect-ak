import * as Effect from "effect/Effect";

import { Anthropic, Openai } from "../vendor/index.js";

export class AiChatCompletionService
  extends Effect.Service<AiChatCompletionService>()("AiChatCompletionService", {
    effect: Effect.gen(function* () {

      const deps = {
        openai: yield* Openai.Text.TextService,
        anthropic: yield* Anthropic.AnthropicCompletionService
      }

      return {
        openai: deps.openai.completeText,
        anthropic: deps.anthropic.completeChat
      } as const;

    }),

    dependencies: [
      Openai.Text.TextService.Default,
      Anthropic.AnthropicCompletionService.Default
    ]
  }) { }
