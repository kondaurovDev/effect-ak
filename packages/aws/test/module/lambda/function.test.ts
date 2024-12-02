import { Effect, Logger, LogLevel } from "effect";
import { describe } from "node:test";
import { assert, it } from "vitest";

import CodeBlockWriter from "code-block-writer";

import * as Lambda from "#/module/lambda/_export.js";
import { LambdaClientServiceConfig } from "#/clients/lambda.js";

describe("lambda function", () => {

  it("upsert function/invoke/delete", async () => {

    const program =
      await Effect.gen(function* () {

        const manage =
          yield* Lambda.LambdaFunctionManageService;

        const writer = new CodeBlockWriter();

        const response =
          yield* manage.upsertFunction({
            functionName: "test-fn3",
            roleName: "lambda-bar",
            description: "from test",
            code: {
              type: "inline",
              code:
                writer.writeLine("export const handler = async () => ").block(() =>
                  writer
                    .writeLine("console.log('Hello')")
                    .writeLine("return 'foobar :)'")
                ).toString()
            },
            runtime: "nodejs22.x",
            configuration: {
              memorySize: 128,
              handler: "index.handler",
              timeout: 20,
              environment: { aaa2: "123" }
            }
          });

        return 1;

      }).pipe(
        Effect.provide([
          Lambda.LambdaFunctionManageService.Default
        ]),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.tapErrorCause(Effect.logError),
        Effect.provide(Logger.pretty),
        Effect.provideService(
          LambdaClientServiceConfig,
          LambdaClientServiceConfig.of({
            region: "eu-west-3"
          })
        ),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  });

})