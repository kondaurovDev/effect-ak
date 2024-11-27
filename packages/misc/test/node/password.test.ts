import { Effect, Logger, LogLevel, pipe, Redacted } from "effect";
import { describe, expect, it } from "vitest";

import { NodePasswordService } from "../../src/node"

describe("node password service", () => {

  it("hash and check", async () => {

    const program =
      await Effect.gen(function* () {

        const pwd = yield* NodePasswordService;

        const hashedPassword =
          yield* pwd.hashPassword("veryLongSuperSecret");

        expect(
          yield* pwd.isPasswordValid(hashedPassword, Redacted.make("veryLongSuperSecret"))
        ).toBeTruthy();

        expect(
          yield* pwd.isPasswordValid(hashedPassword, Redacted.make("secret"))
        ).toBeFalsy();

      }).pipe(
        Effect.tapErrorCause(Effect.logError),
        Effect.provide(NodePasswordService.Default),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.runPromiseExit
      );

  })

})