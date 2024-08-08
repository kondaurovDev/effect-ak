import { describe, it, expect } from "vitest"
import { Effect, pipe } from "effect"

import { getJsonContent } from "./content.js"
import { BucketKey, BucketName } from "./types.js"
import { ServiceLive } from "./service.js"
import { AwsRegionLive } from "../config.js"

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
        Effect.runPromise
      );

    expect(actual).toBeDefined()

  })



})