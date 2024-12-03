import { describe, expect, it, assert } from "vitest"
import { Effect } from "effect"

import { ExtractService } from "#/parse/extract"
import { testEnv } from "test/const";

describe("extract service", () => {

  it("get type/method", async () => {

    const program =
      await Effect.gen(function* () {

        const extract = yield* ExtractService;

        const fullInfo = yield* extract.getTypeMetadata({ typeName: "ChatFullInfo" });
        const restrictChatMember = yield* extract.getMethodMetadata({ methodName: "restrictChatMember" });

        const allTypes = yield* extract.getAllTypeNames;

        expect(allTypes.length).toBeGreaterThan(50);

        expect(fullInfo.description).match(/^This object contains full.*/)

        yield* Effect.logInfo("type", fullInfo);
        yield* Effect.logInfo("method", restrictChatMember);

      }).pipe(
        Effect.provide(testEnv),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  });


});
