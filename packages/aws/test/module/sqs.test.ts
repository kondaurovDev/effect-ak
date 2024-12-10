import { Effect, Logger, LogLevel } from "effect";
import { describe } from "node:test";
import { assert, it } from "vitest";

import * as SQS from "#/module/sqs/index.js";

describe("sqs", () => {

  it("upsert queue", async () => {

    const program =
      await Effect.gen(function* () {

        const $ = yield* SQS.SqsQueueManageService;

        yield* $.upsertQueue({
          queueName: "test",
          attributes: {
            queueType: "standard",
            deliveryDelay: 2,
            retentionPeriod: 3
          }
        });

      }).pipe(
        Effect.provide([
          SQS.SqsQueueManageService.Default
        ]),
        Effect.tapErrorCause(Effect.logError),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  });

})