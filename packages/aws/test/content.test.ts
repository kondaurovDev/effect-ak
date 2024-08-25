import { describe, it, expect } from "vitest"
import { Effect, Logger, LogLevel, pipe } from "effect"
import { AwsRegionLive } from "@efkit/shared"

import { getJsonContent } from "../src/s3/content.js"
import { BucketKey, BucketName } from "../src/s3/types.js"
import { ServiceLive } from "../src/s3/service.js"

describe("content", () => {

  it("get json", async () => {

    const actual = 
      await pipe(
        getJsonContent(
          BucketName("botless"),
          BucketKey("kondaurov-bot/chat-270501423/1427.json"),
        ),
        Effect.provide(ServiceLive),
        Effect.provide(AwsRegionLive("eu-west-1")),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.runPromise
      );

    expect(actual).toBeDefined()

  })

})