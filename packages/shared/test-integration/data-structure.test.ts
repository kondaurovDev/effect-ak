import { describe, expect, it } from "vitest"
import { DateTime, Effect, Exit, Layer, Logger, LogLevel } from "effect";
import OpenAI from "openai"

import { DataStructureService } from "../src/misc/data-structure";
import { ChatCompletionService } from "../src/context";
import { CsvService } from "../src/data-format";

import { GPT_TOKEN } from "../integration-config.json"

const openAiClient =
  new OpenAI({
    apiKey: GPT_TOKEN
  })

const chatGptService =
  Layer.succeed(
    ChatCompletionService,
    ChatCompletionService.of({
      complete: (input) =>
        openAiClient.chat.completions.create({
          model: "gpt-4o",
          modalities: [ "text" ],
          response_format: { type: "text" },
          messages: [
            {
              role: "system", content: input.systemMessage
            },
            {
              role: "user", content: input.userMessage
            }
          ],
        }).then(response => response.choices.at(0)?.message.content!)
    })
  )

const live =
  DataStructureService.Default.pipe(
    Layer.provide([
      chatGptService,
      CsvService.Default
    ])
  )

describe("data structure service", () => {

  it("case 1", async () => {

    const program =
      await Effect.gen(function* () {
        const service = yield* DataStructureService;

        const result =
          yield* service.getStructured({
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
            ouputColumns: [
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
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.provide(live),
        Effect.runPromiseExit
      );

    expect(program).toEqual(Exit.succeed)


  })



})