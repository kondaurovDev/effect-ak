import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as Config from "effect/Config";
import { Path } from "@effect/platform/Path";

import { aiModuleName } from "./const.js";

export class AiSettingsProvider
  extends Effect.Service<AiSettingsProvider>()("AiSettingsProvider", {
    effect:
      Effect.gen(function* () {

        const path = yield* Path;

        const outDir =
          yield* pipe(
            Config.nonEmptyString("output-dir"),
            Config.map(_ => _.split(path.sep)),
            Config.nested(aiModuleName)
          );

        return {
          outDir
        } as const;

      })
  }) { }
