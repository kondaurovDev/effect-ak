import { Effect, pipe } from "effect";
import { describe, expect, it } from "vitest";

import { hashPassword, isPasswordValid } from "../../src/utils";

describe("password test suite", () => {

  it("encrypt", async () => {

    const hashedPassword =
      await pipe(
        hashPassword("veryLongSuperSecret"),
        Effect.runPromise
      )

    const isValid =
      await pipe(
        isPasswordValid(hashedPassword, "secret"),
        Effect.runPromise
      )

    expect(isValid).toBeTruthy();

    const hash1 = "g7EiqRaXBUyldPBOgRj1zo7jd8/e7J/iVGucBcI/vot08mNrTvhG+gC49mljKtWgKaHPccWtkVZlD/4f0oNzBg==.Ru1qRAR2Nv0w3idrS9RIYg==";
    const hash2 = "7RflXD+c/GKqe7VrDW1QnYybB7/bCpwzZN466QR/dXAeY0rGoxw52uZf1zv0fKlf9CS6GT4ZPftL3qyOvsLvwg==.KSPtrJVdPQme2iGM6sMVpw==";

  })

})