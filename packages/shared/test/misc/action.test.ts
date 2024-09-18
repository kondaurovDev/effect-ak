import { describe, it, expect } from "vitest"
import { Effect, Exit, pipe } from "effect";
import { Schema as S } from "@effect/schema"

import { makeAction } from "../../src/misc/index";

class MySchema extends S.Class<MySchema>("MySchema")(
  {
    message: S.NonEmptyString,
    date: S.Number,
    a: 
      pipe(
        S.Positive,
        S.optional
      )
  }) { }

const action =
  makeAction(
    "testAction",
    S.Literal("throwBadRequest", "throwInternalError", "check", "check2"),
    MySchema,
    input => {

      if (input === "throwInternalError") {
        throw Error("Internal error")
      }

      if (input === "throwBadRequest") {
        return Effect.fail(Error("Bad request"))
      }

      if (input === "check2") {
        return S.decode(MySchema)({ message: input, date: 34 })
      }

      return (
        pipe(
          Effect.logInfo("hey"),
          Effect.andThen(
            S.decode(MySchema)({ message: input, date: 434545 })
          )
        )
      )
    }
  );

describe("action test suite", () => {

  it("works with check2", async () => {

    const result =
      await action.checkedRun
        .pipe(
          Effect.provide(action.inputLayer("check2")),
          Effect.runPromiseExit
        );

    expect(Exit.map(result, _ => _.result.message)).toEqual(Exit.succeed("check2"));

  });

  it("case, throwBadRequest", async () => {

    const result2 =
      await action.checkedRun
        .pipe(
          Effect.provide(action.inputLayer("throwBadRequest")),
          Effect.flip,
          Effect.runPromise
        );

    expect(result2._tag).toMatch(/.*ActionError$/)

  })

  it("works with throwInternalError", async () => {

    const result =
      await action.checkedRun
        .pipe(
          Effect.provide(action.inputLayer("throwInternalError")),
          Effect.flip,
          Effect.runPromise
        );

    expect(result.cause.message).toEqual("Internal error")

  })

  it("works with check", async () => {

    const result =
      await action.checkedRun
        .pipe(
          Effect.provide(action.inputLayer("check")),
          Effect.runPromise
        );

    expect(result.logs).not.toHaveLength(0)
    expect(result.result.message).toEqual("check");

  });

})