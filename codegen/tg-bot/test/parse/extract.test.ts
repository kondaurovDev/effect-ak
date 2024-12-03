import { describe, expect, it, assert } from "vitest"
import { Effect } from "effect"

import { MainExtractService } from "#/parse/service/_export"
import { testEnv } from "test/const";

describe("extract service", () => {

  it("main, get type/method", async () => {

    const program =
      await Effect.gen(function* () {

        const service = yield* MainExtractService; 

        const fullInfo = yield* service.getTypeMetadata({ typeName: "ChatFullInfo" });
        const restrictChatMember = yield* service.getMethodMetadata({ methodName: "restrictChatMember" });

        expect(fullInfo.description).match(/^This object contains full.*/);

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
