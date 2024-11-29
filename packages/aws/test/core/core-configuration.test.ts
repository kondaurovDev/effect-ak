import { describe, it, assert, expect } from "vitest";
import { Effect } from "effect";
import { Utils } from "@effect-ak/misc"

import { CoreConfigurationProviderService } from "#core/index.js";

describe("configuration provider service", () => {

  it("get account id and cache it", async () => {

    const result =
      await Effect.gen(function* () {

        const config = yield* CoreConfigurationProviderService;

        const account1 = yield* config.accountId;
        const account2 = yield* config.accountId;

        yield* Effect.logDebug({ account1, account2 });

        expect(account1).greaterThan(0);

      }).pipe(
        Effect.provide([
          CoreConfigurationProviderService.Default,
        ]),
        Effect.provide([
          Utils.LogLevelConfigFromEnv,
        ]),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(result._tag == "Success");

  });

});
