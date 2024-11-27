import { Effect } from "effect";
import { assert, describe, expect, it } from "vitest";
import { SSM } from "@aws-sdk/client-ssm"

import { makeClientWrapper } from "../../src/internal";

describe("sdk client wrapper", () => {

  it("catch error at error level", async () => {

    const program =
      await Effect.gen(function* () {
        const sdkClient = new SSM({});
        const client = yield* makeClientWrapper("SSM", () => sdkClient);

        const response = 
          yield* client.$execute("getParameter", { Name: "foo" }).pipe(Effect.either);

        assert(response._tag == "Left", "must be left");

        expect(response.left.$metadata.httpStatusCode).toEqual(404);

      }).pipe(
        Effect.scoped,
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Failure");

  });

})