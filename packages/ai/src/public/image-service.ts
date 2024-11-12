import * as Effect from "effect/Effect";

import { Stabilityai } from "../vendor/index.js";

export class AiImageService
  extends Effect.Service<AiImageService>()("AiImageService", {
    effect:
      Effect.gen(function* () {

        const deps = {
          stabilityai: yield* Stabilityai.ImageGenerationService
        };

        return {
          stabilityai: deps.stabilityai
        } as const;

      }),

    dependencies: [
      Stabilityai.ImageGenerationService.Default
    ]
  }) { }
