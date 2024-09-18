import { describe, it, expect, vi } from "vitest"
import { Effect, Logger, LogLevel, pipe } from "effect";
import { Schema as S } from "@effect/schema"

import { trySafePromise } from "../../src/misc/index";

const actionStub = vi.fn()

actionStub.mockResolvedValue

const ErrorShema = 
  S.Struct({
    message: S.String
  });

describe("promise test suite", () => {

  it("fail with error", async () => {

    actionStub.mockRejectedValue(Error("Some error"))

    const failed =
      await pipe(
        trySafePromise("make fail", actionStub, ErrorShema),
        Effect.flip,
        Effect.runPromise
      );

    expect(failed.cause.message).toEqual("Some error");

  })

  it("return successful resutl", async () => {

    actionStub.mockResolvedValue("Good result")

    const success =
      await pipe(
        trySafePromise("resolve some", actionStub, ErrorShema),
        Effect.runPromise
      );

    expect(success).toEqual(`Good result`);

  })

  it("fail with unexpected error", async () => {

    actionStub.mockRejectedValue({ clientError: "some internal error"})

    const success =
      await pipe(
        trySafePromise("my action", actionStub, ErrorShema),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.flip,   
        Effect.runPromise,
      );

    expect(success._tag).toMatch(/.*PromiseSchemaError$/);

  })

})