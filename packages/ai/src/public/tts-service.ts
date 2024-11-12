import * as Effect from "effect/Effect";

import { Openai } from "../vendor/index.js";

export class OpenaiTextToSpeechService
  extends Effect.Service<OpenaiTextToSpeechService>()("OpenaiTextToSpeechService", {
    effect: Effect.gen(function* () {

      const deps = {
        openai: yield* Openai.Audio.OpenaiTextToSpeech
      };

      return {
        openai: deps.openai.createSpeech
      } as const;

    }),

    dependencies: [
      Openai.Audio.OpenaiTextToSpeech.Default
    ]
  }) { }
