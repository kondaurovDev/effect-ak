import { describe, expect, it, assert } from "vitest"
import { Effect, Either } from "effect"

import { ParseTypeMapService } from "#/parse/service/_export"
import { testEnv } from "test/const";

describe("mapper service", () => {

  it("get normal type", async () => {

    const program =
      await Effect.gen(function* () {

        const mapper = yield* ParseTypeMapService;

        const check = 
          (docType: string, expected: string) => {
            const t = mapper.getNormalType({
              entityName: "SomeUnknown",
              description: "",
              typeName: docType
            }).pipe(Either.andThen(_ => _.tsType));
            assert(t._tag == "Right");
            expect(t, expected)
          } 

        check("String or Integer", "string | number");
        check("Boolean", "boolean");
        check("True","true");
        check("Array of String", "string[]");
        check("Array of Integer", "number[]");
        check("Array of ChatObject", "ChatObject[]");

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

        const check = 
          (input: {
            description: string,
            expected: string
          }) => {
            const actual = 
              mapper.getSentenceOfReturnType({
                methodDescription: input.description
              });
            assert(actual._tag == "Right");
            expect(actual.right).toEqual(input.expected)
          }

        check({
          description: "Use this method to send an animated emoji that will display a random value. On success, the sent Message is returned.",
          expected: "On success, the sent Message is returned"
        });

        check({
          description: "Use this method to get the current default administrator rights of the bot. Returns ChatAdministratorRights on success.",
          expected: "Returns ChatAdministratorRights on success"
        });

        check({
          description: ".MP3 format, or in .M4A format (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.",
          expected: "On success, the sent Message is returned"
        });

        check({
          description: "When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned. Note that business messages that were not sent by",
          expected: "On success, if the edited message is not an inline message, the edited Message is returned, otherwise True is returned"
        });

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

        const mapper = yield* ParseTypeMapService;

        const check =
          (input: {
            description: string,
            expected: string
          }) => {
            const actual = 
            mapper.getNormalReturnType(({
              methodName: "SomeUnknown",
              methodDescription: input.description,
            }));
            assert(actual._tag == "Right");
            expect(actual.right.tsType).toEqual(input.expected)
          }

        check({
          description: "Foo. Returns True on success",
          expected: "true"
        });

        check({
          description: "On success, the sent Message is returned",
          expected: "Message"
        });

        check({
          description: "A is returned or B is returned or C is returned",
          expected: "A | B | C"
        });

      }).pipe(
        Effect.provide(testEnv),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  });

});
