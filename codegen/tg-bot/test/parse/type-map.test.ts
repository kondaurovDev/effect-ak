import { describe, expect, it, assert } from "vitest"
import { Effect } from "effect"

import { ParseTypeMapService } from "#/parse/service/_export"
import { testEnv } from "test/const";

describe("mapper service", () => {

  it("get normal type", async () => {

    const program =
      await Effect.gen(function* () {

        const mapper = yield* ParseTypeMapService;

        const make =
          (typeName: string) => ({
            entityName: "SomeUnknown",
            description: "",
            typeName
          });

        expect(mapper.getNormalType(make("String or Integer"))).toEqual("string | number");
        expect(mapper.getNormalType(make("Boolean"))).toEqual("boolean");
        expect(mapper.getNormalType(make("True"))).toEqual("true");
        expect(mapper.getNormalType(make("Array of String"))).toEqual("string[]");
        expect(mapper.getNormalType(make("Array of Integer"))).toEqual("number[]");
        expect(mapper.getNormalType(make("Array of ChatObject"))).toEqual("ChatObject[]");

      }).pipe(
        Effect.provide(testEnv),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  });

  it("extract return type sentence", async () => {

    const program =
      await Effect.gen(function* () {

        const mapper = yield* ParseTypeMapService;

        const ret1 =
          yield* mapper.getSentenceOfReturnType({
            methodDescription: "Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned."
          });

        expect(ret1).toEqual("On success, the sent Message is returned");

        const ret2 =
          yield* mapper.getSentenceOfReturnType({
            methodDescription: "Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success."
          });

        expect(ret2).toEqual("Returns ChatAdministratorRights on success");

        const ret3 =
          yield* mapper.getSentenceOfReturnType({
            methodDescription: ".MP3 format, or in .M4A format (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future."
          });

        expect(ret3).toEqual("On success, the sent Message is returned");

        const ret4 =
          yield* mapper.getSentenceOfReturnType({
            methodDescription: "When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by"
          });

        expect(ret4).toEqual("On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned");

      }).pipe(
        Effect.provide(testEnv),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success");

  });

  it("get normal return type", async () => {

    const program =
      await Effect.gen(function* () {

        const make =
          (description: string) => ({
            methodName: "SomeUnknown",
            methodDescription: description,
          });

        const mapper = yield* ParseTypeMapService;

        expect(yield* mapper.getNormalReturnType(make("Foo. Returns True on success"))).toEqual("true");
        expect(yield* mapper.getNormalReturnType(make("On success, the sent Message is returned"))).toEqual("Message");
        expect(yield* mapper.getNormalReturnType(make("A is returned or B is returned or C is returned"))).toEqual("A | B | C");

      }).pipe(
        Effect.provide(testEnv),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  });

});
