import { assert, describe, it } from "vitest"
import { DateTime, Effect, Logger } from "effect";
import { LogLevelConfigFromEnv } from "@effect-ak/misc";

import { AiDataStructureService } from "../src/public";

const live =
  AiDataStructureService.Default

describe("data structure service", () => {

  it("case 1", async () => {

    const program =
      await Effect.gen(function* () {
        const service = yield* AiDataStructureService;

        const result =
          yield* service.getStructured({
            providerName: "anthropic",
            objects: [
              {
                phrase: "bought a table for 10 dollars"
              },
              {
                phrase: "20 dollars spent for a chair, two days ago"
              },
            ],
            instruction: `today is ${DateTime.formatIsoOffset(DateTime.unsafeNow())}`,
            inputColumns: [
              {
                columnName: "phrase",
                description: "User's phrase"
              }
            ],
            outputColumns: [
              {
                columnName: "price",
                description: "price for thing",
              },
              {
                columnName: "thing",
                description: "thing's name",
              },
              {
                columnName: "date",
                description: "in format YYYY-MM-DD",
              }
            ]
          });

        return result;
      }).pipe(
        Effect.provide([
          live, Logger.pretty, LogLevelConfigFromEnv
        ]),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success");

    assert(program.value.length == 2);

  })

})