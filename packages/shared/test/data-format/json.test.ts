import { Effect, Exit } from "effect";
import { assert, describe, expect, it } from "vitest";

import { JsonService } from "../../src/data-format"

describe("Json data service", () => {

  it("encode should work", () => {

    const program = 
      Effect.gen(function* () {

        const service = yield* JsonService;

        const encoded1 =
          yield* service.encode({ prop1: 1, prop2: null })

        return {
          encoded1
        }

      }).pipe(
        Effect.provide(JsonService.Default),
        Effect.runSyncExit
      );

    assert(Exit.isSuccess(program))

    expect(JSON.parse(program.value.encoded1)).toEqual({ prop1: 1, prop2: null })
    
  })


})