import { describe, expect, it } from "vitest"
import { DateTime, Effect, Exit, Logger } from "effect";
import { LogLevelConfigFromEnv } from "@effect-ak/misc";

import { DataStructureService } from "../src/service/data-structure";
import { ProviderName } from "../src/interface/chat-completion";

const live =
  DataStructureService.Default

describe("data structure service", () => {

  it("case 1", async () => {

    const program =
      await Effect.gen(function* () {
        const service = yield* DataStructureService;

        const result =
          yield* service.getStructured({
            model: { provider: ProviderName.make("anthropic")},
            objects: [
              {
                phrase: "bought a table for 10 dollars"
              },
              {
                phrase: "20 dollars spent for a chair, two days ago"
              },
            ],
            instruction: `today is ${DateTime.unsafeNow()}`,
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
          
        console.log(result);

        return result;
      }).pipe(
        Effect.provide([
          live, Logger.pretty, LogLevelConfigFromEnv
        ]),
        Effect.runPromiseExit
      );

    expect(program).toEqual(Exit.succeed)

  })

})