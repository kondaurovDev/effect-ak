import { describe, expect, it, assert } from "vitest"
import { Effect, pipe } from "effect"

import { DocPage, MainExtractService, MetaExtractService } from "#/parse/service/_export"
import { testLayer } from "../const.js";

describe("extract services", () => {

  it("main service, parse description", async () => {

    const parseDescription = MainExtractService.descriptionParser();

    const sendMessageDescriptionNode = 
      await pipe(
        DocPage,
        Effect.andThen(_ => _.pageContent.querySelector("h4 > a#sendmessage")?.parentNode.nextElementSibling),
        Effect.provide([
          testLayer
        ]),
        Effect.runPromise
      );

    assert(sendMessageDescriptionNode != null);

    const actual = parseDescription(sendMessageDescriptionNode);

    expect(actual).toEqual([
      "Use this method to send text messages",
      "On success, the sent Message is returned"
    ]);

  })

  it("main service, get type/method", async () => {

    const program =
      await Effect.gen(function* () {

        const service = yield* MainExtractService;

        const methods = {
          sendMessage: yield* service.getMethodMetadata({ methodName: "sendMessage" }),
          sendVoice: yield* service.getMethodMetadata({ methodName: "sendVoice" })
        }

        const fullInfo = yield* service.getTypeMetadata({ typeName: "ChatFullInfo" });

        assert(fullInfo._tag == "TypeMetadataFields");

        expect(fullInfo.description).match(/^This object contains full.*/);

        const field1 = fullInfo.fields.find(_ => _.name == "accent_color_id");

        expect(field1?.required).toBeTruthy();
        expect(field1?.type.tsType).toEqual("number");

        const field2 = fullInfo.fields.find(_ => _.name == "available_reactions");
        expect(field2?.type.tsType).toEqual("ReactionType[]");
        expect(field2?.required).toBeFalsy();

      }).pipe(
        Effect.provide(testLayer),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  });

  it("meta service, get namespace", async () => {

    const program =
      await Effect.gen(function* () {

        const service = yield* MetaExtractService;

        const primary = service.getNamespaceMetadata({ namespace: "primary" });

        expect(primary.methods.length).toBeGreaterThan(70);
        expect(primary.types.length).toBeGreaterThan(100);

      }).pipe(
        Effect.provide(testLayer),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success");

    program

  })

});
