import { Effect, pipe } from "effect";
import { describe, expect, it } from "vitest";
import { AwsRegionLive } from "@efkit/shared";

import { putJsonParameter, T } from "../src/ssm"

describe("kms test suite", () => {

  const keyId = "alias/aws/ssm"

  it("put secret", async () => {
    const value = { prop1: "bla", num: 1 };

    const actual = 
      await pipe(
        putJsonParameter(T.ParameterName("/param2"), value),
        Effect.provide(AwsRegionLive("eu-west-2")),
        Effect.runPromise
      );

    expect(actual).toBeDefined()
    
  });

})