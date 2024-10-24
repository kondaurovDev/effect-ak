import { describe, it, expect } from "vitest"
import { Effect, pipe } from "effect";

import { hashText } from "../../src/utils"

describe("text", () => {

  it("get hash", async () => {

    const actual = 
      pipe(
        hashText("someText"),
        Effect.runSync
      );

    expect(actual).toBeDefined();

  });

});
