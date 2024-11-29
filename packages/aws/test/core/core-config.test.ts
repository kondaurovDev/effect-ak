import { ConfigProvider, Effect } from "effect";
import { assert, describe, expect, it } from "vitest";

import { AwsRegionConfig } from "#core/index.js";

describe("resolve configs", () => {

  it("awsRegionConfig fails on wrong region", async () => {

    const program =
      await Effect.gen(function* () {
        yield* AwsRegionConfig;
      }).pipe(
        Effect.withConfigProvider(
          ConfigProvider.fromJson({
            "effect-ak-aws": {
              region: "eu"
            }
          })
        ),
        Effect.runPromiseExit
      );

    assert(program._tag == "Failure");

  });

  it("awsRegionConfig succeeds on correct input", async () => {

    const program =
      await Effect.gen(function* () {
        const region = yield* AwsRegionConfig;
        expect(region).toEqual("eu-west-1")
      }).pipe(
        Effect.withConfigProvider(
          ConfigProvider.fromJson({
            "effect-ak-aws": {
              region: "eu-west-1"
            }
          })
        ),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success");

  })

})