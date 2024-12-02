import { Effect, Equal } from "effect";
import { assert, it, describe } from "vitest";

import * as Lambda from "#/module/lambda/_export.js";

describe("lambda, function configuration", () => {

  it("check equalty", async () => {

    const program =
      await Effect.gen(function* () {

        const factory =
          yield* Lambda.LambdaFunctionConfigurationFactoryService;

        const input = {
          handler: "index.js",
          memorySize: 128,
          timeout: 20,
          environment: {
            a1: "asd"
          }
        };

        const a =
          yield* factory.make(input);

        const a2 =
          yield* factory.make(input);

        const a3 =
          yield* factory.make({
            ...input,
            environment: {
              a2: "asd"
            }
          });

        assert(Equal.equals(a, a2), "must be equal");
        assert(!Equal.equals(a2, a3), "must be different");

      }).pipe(
        Effect.provide([
          Lambda.LambdaFunctionConfigurationFactoryService.Default
        ]),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  });

})
