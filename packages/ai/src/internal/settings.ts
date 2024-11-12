import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as Config from "effect/Config";
import { Path } from "@effect/platform/Path";
import { FileSystem } from "@effect/platform/FileSystem";

import { aiModuleName } from "./const.js";

export class AiSettingsProvider
  extends Effect.Service<AiSettingsProvider>()("AiSettingsProvider", {
    effect:
      Effect.gen(function* () {

        const path = yield* Path;
        const fs = yield* FileSystem;

        const outDir =
          yield* pipe(
            Config.nonEmptyString("output-dir"),
            Config.nested(aiModuleName),
            Config.withDefault(path.resolve(".out", "ai")),
          );

        const exists = yield* fs.exists(path.resolve(...outDir));

        yield* Effect.logDebug("AI output dir", { exists, outDir });

        return {
          outDir
        } as const;

      })
  }) { }
