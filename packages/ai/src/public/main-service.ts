import * as Effect from "effect/Effect";

import { Anthropic, Openai, Stabilityai } from "../vendor/index.js";

export class AiMainService
  extends Effect.Service<AiMainService>()("AiMainService", {
    effect: Effect.gen(function* () {

      const openaiTextService = yield* Openai.Text.TextService;
      const anthropic = yield* Anthropic.AnthropicCompletionService;
      const stabilityai = yield* Stabilityai.ImageGenerationService;

      return {
        openai: {
          completeChat: openaiTextService.completeText
        },
        anthropic: {
          completeChat: anthropic.completeChat
        },
        stabilityai: {
          generateImage: stabilityai.generateImage
        }
      } as const;

    }),

    dependencies: [
      Openai.Text.TextService.Default,
      Anthropic.AnthropicCompletionService.Default,
      Stabilityai.ImageGenerationService.Default
    ]
  }) { }
