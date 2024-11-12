import { HttpApiBuilder } from "@effect/platform";
import { Effect, pipe, Array } from "effect";

import { UnknownError } from "../definition.js";
import { UtilService } from "../../util.js";
import { BackendApi } from "../http-api.js";

export const htmlRoute =
  HttpApiBuilder.group(BackendApi, "html", handlers =>
    Effect.gen(function* () {
      const util = yield* UtilService;
      return handlers
        .handle("ask-ai", ({ path }) =>
          pipe(
            util.readFileFromProjectRoot(
              Array.modifyNonEmptyLast(["html", ...path.path], _ => _ + ".html")
            ),
            Effect.catchAll(() =>
              Effect.fail(new UnknownError())
            )
          )
        )
    })
  )