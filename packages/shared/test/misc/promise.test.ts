import { describe, it, expect, vi } from "vitest"
import { Effect, pipe } from "effect";

import { Constructor, liftPromiseToEffect, PromiseError } from "../../src/misc/index";

const actionStub = vi.fn()

actionStub.mockResolvedValue

function createErrorConstructor(message: string): Constructor<Error> {
  return class extends Error {
    constructor() {
      super(message);
    }
  };
}

describe("promise test suite", () => {

  it("fail with error", async () => {

    const constructor = createErrorConstructor("Some error")
    actionStub.mockRejectedValue(new constructor);

    const failed =
      await pipe(
        liftPromiseToEffect("make fail", actionStub, constructor),
        Effect.flip,
        Effect.runPromise
      );

    expect((failed as PromiseError<Error>).typedError.message).toEqual("Some error");

  })

  it("return successful resutl", async () => {

    const constructor = createErrorConstructor("Some error")
    actionStub.mockResolvedValue("Good result")

    const result =
      await pipe(
        liftPromiseToEffect("resolve some", actionStub, constructor),
        Effect.runPromise
      );

    expect(result.success).toEqual(`Good result`);

  })

})