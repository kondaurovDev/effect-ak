import * as Effect from "effect/Effect";
import { Anthropik, Openai, Stabilityai } from "../internal/index.js";

export class AiMainService
  extends Effect.Service<AiMainService>()("AiMainService", {
    effect: Effect.gen(function* () {

      const openaiTextService = yield* Openai.Text.TextService;
      const anthropik = yield* Anthropik.AnthropicCompletionService;
      const stabilityai = yield* Stabilityai.ImageGenerationService;

      return {
        openai: {
          completeChat: openaiTextService.completeText
        },
        anthropik: {
          completeChat: anthropik.completeChat
        },
        stabilityai: {
          generateImage: stabilityai.generateImage
        }
      } as const;

    }),

    dependencies: [
      Openai.Text.TextService.Default,
      Anthropik.AnthropicCompletionService.Default,
      Stabilityai.ImageGenerationService.Default
    ]
  }) { }
