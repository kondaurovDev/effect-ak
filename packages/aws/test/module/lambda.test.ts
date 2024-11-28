import { Data, Effect, Equal, Logger, LogLevel, Schema } from "effect";
import { describe } from "node:test";
import { assert, it } from "vitest";
import CodeBlockWriter from "code-block-writer";

import * as Lambda from "../../src/module/lambda";

describe("lambda, function configuration", () => {

  it("check equalty", async () => {

    const program =
      await Effect.gen(function* () {

        const factory =
          yield* Lambda.LambdaFunctionConfigurationFactoryService;

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

        assert(Schema.is(Lambda.LambdaFunctionConfiguration)(input) == false, "is must return false");

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
          Lambda.LambdaFunctionConfigurationFactoryService.Default
        ]),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  });

  it("upsert function/invoke/delete", async () => {

    const program =
      await Effect.gen(function* () {

        const manage =
          yield* Lambda.LambdaFunctionManageService;

        const writer = new CodeBlockWriter();

        const response =
          yield* manage.upsertFunction({
            functionName: "test-fn",
            role: "arn:aws:iam::906667703291:role/botless/ai-bot",
            code: {
              type: "inline",
              code:
                writer.writeLine("export const handler = async () => ").block(() =>
                  writer
                    .writeLine("console.log('Hello')")
                    .writeLine("return 'foo'")
                ).toString()
            },
            runtime: "nodejs22.x",
            configuration:
              Lambda.LambdaFunctionConfiguration.make({
                MemorySize: 128,
                Handler: "index.mjs",
                Timeout: 10,
                Environment:
                  Lambda.LambdaFunctionConfigurationEnvironment.make({
                    Variables: Data.struct({})
                  })
              })
          });

        return 1;

      }).pipe(
        Effect.provide([
          Lambda.LambdaFunctionManageService.Default
        ]),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  });

})