import { describe, it, expect } from "bun:test"
import { getJsonContent } from "./content"
import { BucketKey, BucketName } from "./types"
import { ServiceLive } from "./service"
import { Effect, pipe } from "effect"
import { AwsRegionLive } from "../config"

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