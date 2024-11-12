import { HttpApiBuilder } from "@effect/platform";
import { Effect, pipe, Array } from "effect";

import { UnknownError } from "../definition.js";
import { UtilService } from "../../util.js";
import { BackendApi } from "../http-api.js";

export const staticRoute =
  HttpApiBuilder.group(BackendApi, "static", handlers =>
    Effect.gen(function* () {
      const util = yield* UtilService;
      return handlers
        .handle("css", ({ path }) =>
          pipe(
            util.readFileFromNodeModules(
              Array.modifyNonEmptyLast([...path.path], _ => _ + ".css"),
            ),
            Effect.catchAll(() =>
              Effect.fail(new UnknownError())
            )
          )
        ).handle("js", ({ path }) =>
          pipe(
            util.readFileFromNodeModules(
              Array.modifyNonEmptyLast([...path.path], _ => _ + ".js"),
            ),
            Effect.catchAll(() =>
              Effect.fail(new UnknownError())
            )
          )
        ).handle("generated-image", ({ path }) =>
          pipe(
            util.readFileBytesFromProjectRoot(
              Array.modifyNonEmptyLast([".out", "ai", ...path.path], _ => _ + ".webp"),
            ),
            Effect.catchAll(() =>
              Effect.fail(new UnknownError())
            )
          )
        )
    })
  )