import { describe, it, expect } from "vitest"
import { Effect, pipe } from "effect";
import { Schema as S } from "@effect/schema"

import { ActionError, makeAction } from "../src/action";

class MySchema extends S.Class<MySchema>("MySchema")(
  {
    message: S.NonEmptyString
  }, {
  title: "body"
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
        return new MySchema({ message: input })
      }

      return (
        pipe(
          Effect.logInfo("hey"),
          Effect.andThen(
            new MySchema({ message: input })
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
          Effect.runPromise
        );

    expect(result.result).toEqual({ message: "check2" });

  });

  it("case, throwBadRequest", async () => {

    const result2 =
      await action.checkedRun
        .pipe(
          Effect.provide(action.inputLayer("throwBadRequest")),
          Effect.flip,
          Effect.runPromise
        );

    expect(result2._tag).toEqual("ActionError");

  })

  it("works with throwInternalError", async () => {

    const result =
      await action.checkedRun
        .pipe(
          Effect.provide(action.inputLayer("throwInternalError")),
          Effect.flip,
          Effect.runPromise
        ) as ActionError;

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
    expect(result.result).toEqual({ message: "check" });

  });

})