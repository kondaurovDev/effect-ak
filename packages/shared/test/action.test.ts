import { describe, it, expect } from "vitest"
import { Effect } from "effect";
import { Schema as S } from "@effect/schema"

import { Action, ActionName } from "../src/action"

const action =
  Action(
    ActionName("testAction"),
    S.Literal("throwBadRequest", "throwInternalError", "check", "check2"),
    S.Struct({ message: S.NonEmptyString }),
    input => {

      if (input === "throwInternalError") {
        throw Error("Internal error")
      }

      if (input === "throwBadRequest") {
        return Effect.fail(Error("Bad request"))
      }

      if (input === "check2") {
        return { message: input }
      }

      return Effect.succeed({ message: input });
    }
  );

describe("action test suite", () => {

  it("works with check2", async () => {

    const result =
      await action.actionWithInput
        .pipe(
          Effect.provide(action.createInput("check2")),
          Effect.runPromise
        );

    expect(result).toEqual({ message: "check2" });

  });

  it("case, throwBadRequest", async () => {

    const result2 =
      await action.actionWithInput
        .pipe(
          Effect.provide(action.createInput("throwBadRequest")),
          Effect.flip,
          Effect.runPromise
        );

    expect(result2.message).toEqual("Execution error (Bad request)")

  })

  it("works with throwInternalError", async () => {

    const result =
      await action.actionWithInput
        .pipe(
          Effect.provide(action.createInput("throwInternalError")),
          Effect.flip,
          Effect.runPromise
        );

    expect(result.message).toEqual("Execution error (Internal error)")

  })

  it("works with check", async () => {

    const result =
      await action.actionWithInput
        .pipe(
          Effect.provide(action.createInput("check")),
          Effect.runPromise
        );

    expect(result).toEqual({ message: "check" });

  });

})