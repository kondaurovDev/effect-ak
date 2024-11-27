import { Effect, Equal, Schema } from "effect";
import { describe } from "node:test";
import { assert, it } from "vitest";

import { 
  LambdaFunctionConfigurationFactoryService, LambdaFunctionConfiguration
} from "../../src/module/lambda/function-configuration";

describe("lambda, function configuration", () => {

  it("check equalty", async () => {

    const program =
      await Effect.gen(function* () {

        const factory =
          yield* LambdaFunctionConfigurationFactoryService;

        const input = {
          Handler: "index.js",
          MemorySize: 128,
          Timeout: 20,
          Environment: {
            Variables: {
              a1: "asd"
            }
          }
        };

        assert(Schema.is(LambdaFunctionConfiguration)(input) == false, "is must return false");

        const a =
          yield* factory.makeConfiguration(input);

        const a2 =
          yield* factory.makeConfiguration({
            ...a
          });

        const a3 =
          yield* factory.makeConfiguration({
            ...a,
            Environment: {
              Variables: {
                a2: "asd"
              }
            }
          });

        assert(Equal.equals(a, a2), "must be equal");
        assert(!Equal.equals(a2, a3), "must be different");

      }).pipe(
        Effect.provide([
          LambdaFunctionConfigurationFactoryService.Default
        ]),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  })


})