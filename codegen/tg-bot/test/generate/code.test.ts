import { describe, it, assert } from "vitest"
import { Effect, ManagedRuntime } from "effect"

import { WriteCodeService } from "#/generate/service/_export";
import { testRuntime } from "../const.js";

describe("write services", () => {

  it("code service, create file and write one line", async () => {

    const program =
      await Effect.gen(function* () {

        const service = yield* WriteCodeService;

        const primary = yield* service.createTsFile({ fileName: "test2" });

        primary.addStatements(writer =>
          writer.writeLine("//** fist line")
        );

      }).pipe(
        Effect.provide(testRuntime),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );


    if (ManagedRuntime.isManagedRuntime(testRuntime)) {
      const a = await testRuntime.runtime()
    }

    assert(program._tag == "Success")

  })

});
