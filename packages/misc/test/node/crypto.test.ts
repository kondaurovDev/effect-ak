import { describe, it, expect } from "vitest"
import { Effect } from "effect";

import { NodeCryptoService } from "../../src/node";

describe("crypto service", () => {

  it("check hash", async () => {

    const program = 
      Effect.gen(function* () {

        const text = yield* NodeCryptoService;

        const hashed = yield* text.hashText("some text");

        expect(hashed).not.toEqual("");

      }).pipe(
        Effect.provide(NodeCryptoService.Default),
        Effect.runPromiseExit,
      );

  });

});
