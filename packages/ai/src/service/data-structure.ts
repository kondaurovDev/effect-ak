import { Effect, Match, pipe } from "effect";
import * as S from "effect/Schema";
import { Column, CsvService, CsvCompatibleObject } from "@effect-ak/misc/data-format";

import { Anthropik, Openai } from "../vendor/index.js";
import { GenerativeModelName } from "../domain/chat-completion.js";

export class DataStructureCommand
  extends S.Class<DataStructureCommand>("DataStructureCommand")({
    model: GenerativeModelName,
    instruction: S.NonEmptyString,
    objects: CsvCompatibleObject.pipe(S.NonEmptyArray),
    inputColumns: Column.pipe(S.NonEmptyArray),
    outputColumns: Column.pipe(S.NonEmptyArray),
  }) { };

export class DataStructureService
  extends Effect.Service<DataStructureService>()("DataStructureService", {
    effect:
      Effect.gen(function* () {

        const csvService = yield* CsvService;

        const completion = {
          anthropic: yield* Anthropik.AnthropicCompletionService,
          openai: yield* Openai.OpenaiChatCompletionEndpoint
        }
        
        const makeSystemMessage = (
          command: DataStructureCommand
        ) =>
          `
            # Instruction
            ${command.instruction}

            # Input
            Will be provided in first user message

            # Output

            - Must be provided in CSV format with table header (use exact column names)
            - Must be provided without introduction words or markdown
            - Column separator is '${csvService.columnSeparator}'
            - break line is the standard unix's symbol n

            ## CSV columns:
            ${command.outputColumns.map((column, index) =>
            `${index + 1} - ${column.columnName} - ${column.description}`
          ).join("\n")}
          `

        const getStructured = (
          command: DataStructureCommand
        ) =>
          Effect.gen(function* () {

            yield* Effect.logDebug("starting =>");

            const csvUserInput =
              csvService.encode({
                columns: command.inputColumns, objects: command.objects
              })

            const request = {
              model: command.model,
              systemMessage: makeSystemMessage(command),
              userMessage: csvUserInput
            }

            yield* Effect.logDebug("data structure request =>", request);

            const result =
              yield* pipe(
                pipe(
                  Match.value(command.model),
                  Match.when(({ provider: "openai" }), () =>
                    completion.openai.complete(request)
                  ),
                  Match.when(({ provider: "anthropic" }), () =>
                    completion.anthropic.complete(request)
                  ),
                  Match.exhaustive
                ),
                Effect.andThen(response =>
                  pipe(
                    Effect.logDebug("csv response", response),
                    Effect.andThen(() =>
                      csvService.decode(response.split("\n"))
                    )
                  )
                )
              )

            return result;

          })

        return {
          getStructured
        } as const;

      }),

    dependencies: [
      CsvService.Default,
      Openai.OpenaiChatCompletionEndpoint.Default,
      Anthropik.AnthropicCompletionService.Default
    ]

  }) { }