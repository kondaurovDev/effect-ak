import { describe, it, assert, expect } from "vitest";
import { Effect } from "effect";

import { Util } from "@effect-ak/misc"

import * as Sts from "../../src/module/sts";

describe("sts service", () => {

  it("get account id and cache it", async () => {

    const result =
      await Effect.gen(function* () {

        const sts = yield* Sts.StsService;

        yield* Effect.logDebug({ account: sts.accountId });

        expect(sts.accountId).not.toEqual("");

      }).pipe(
        Effect.provide([
          Sts.StsService.Default,
        ]),
        Effect.provide([
          Util.LogLevelConfigFromEnv,
        ]),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(result._tag == "Success");

  });

});
