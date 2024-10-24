import { describe, expect, it } from "vitest"
import { DateTime, Effect, Exit, Layer, Logger, LogLevel } from "effect";
import OpenAI from "openai"

import { DataStructureService } from "../src/service/data-structure";
import { ChatCompletionService } from "../src/service";

import { GPT_TOKEN } from "../../misc/integration-config.json"

const openAiClient =
  new OpenAI({
    apiKey: GPT_TOKEN
  })

const chatGptCompletionService =
  Layer.succeed(
    ChatCompletionService,
    ChatCompletionService.of({
      complete: (input) =>
        openAiClient.chat.completions.create({
          model: input.model.modelName ?? "gpt-4o",
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
  DataStructureService.Default

describe("data structure service", () => {

  it("case 1", async () => {

    const program =
      await Effect.gen(function* () {
        const service = yield* DataStructureService;

        const result =
          yield* service.getStructured({
            model: { provider: "openai" },
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
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.provide([
          live,
          chatGptCompletionService
        ]),
        Effect.runPromiseExit
      );

    expect(program).toEqual(Exit.succeed)


  })



})