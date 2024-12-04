import { describe, expect, it, assert } from "vitest"
import { Effect, Logger } from "effect"

import { MainExtractService } from "#/parse/service/_export"
import { testEnv } from "test/const";

describe("extract service", () => {

  it("main, get type/method", async () => {

    const program =
      await Effect.gen(function* () {

        const service = yield* MainExtractService; 

        const fullInfo = yield* service.getTypeMetadata({ typeName: "ChatFullInfo" });
        const restrictChatMember = yield* service.getMethodMetadata({ methodName: "restrictChatMember" });

        assert(fullInfo._tag == "TypeMetadataFields");

        expect(fullInfo.description).match(/^This object contains full.*/);

        const field1 = fullInfo.fields.find(_ => _.name == "accent_color_id");

        expect(field1?.required).toBeTruthy();
        expect(field1?.type.tsType).toEqual("number");

        const field2 = fullInfo.fields.find(_ => _.name == "available_reactions");
        expect(field2?.type.tsType).toEqual("ReactionType[]");

        expect(field2?.required).toBeFalsy();

        yield* Effect.logInfo(fullInfo);
        yield* Effect.logInfo(restrictChatMember);

      }).pipe(
        Effect.provide(testEnv),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

    program

  });

});
