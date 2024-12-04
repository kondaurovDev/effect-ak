import { describe, it, assert } from "vitest"
import { Effect } from "effect"

import { GenerateNamespaceService } from "#/generate/service/_export";
import { testRuntime } from "../const.js";

describe("write services", () => {

  it("generate namespace ", async () => {

    const program =
      await Effect.gen(function* () {

        const service = yield* GenerateNamespaceService;

        const primary = yield* service.generate({ namespace: "primary" });

      }).pipe(
        Effect.provide(testRuntime),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  })

});
