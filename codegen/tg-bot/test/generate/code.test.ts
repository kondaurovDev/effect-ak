import { describe, it, assert } from "vitest"
import { Effect } from "effect"

import { WriteCodeService } from "#/generate/service/_export";
import { testLayer } from "../const.js";

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
        Effect.provide(testLayer),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  })

});
