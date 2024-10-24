import { Effect, pipe } from "effect";
import * as S from "effect/Schema";

import { Column, CsvService, CsvCompatibleObject } from "../data-format/index.js";
import { ChatCompletionService } from "../context/chat-completion.js";

export class DataStructureCommand
  extends S.Class<DataStructureCommand>("DataStructureCommand")({
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

        const makeSystemMessage = (
          command: DataStructureCommand
        ) =>
          `
            # Instruction
            ${command.instruction}

            # Input
            Will be provided in first user message

            # Output

            - Must be provided in CSV format, without table header, introduction words or markdown
            - Column separator is '${csvService.defaultSeparator}'

            ## CSV columns:
            ${command.outputColumns.map((column, index) =>
            `${index + 1} - ${column.columnName} - ${column.description}`
          ).join("\n")}
          `

        const getStructured = (
          command: DataStructureCommand
        ) =>
          Effect.gen(function* () {

            const chatCompletion = yield* ChatCompletionService;

            const request = {
              systemMessage: makeSystemMessage(command),
              userMessage:
                csvService.encode({
                  columns: command.inputColumns, objects: command.objects
                })
            }

            yield* Effect.logDebug(request);

            const result =
              yield* pipe(
                Effect.tryPromise(() => chatCompletion.complete(request)),
                Effect.andThen(response =>
                  csvService.decode({
                    lines: response.split("\n"),
                    columns: command.outputColumns
                  })
                )
              )

            return result;
            
          })

        return {
          getStructured
        } as const;

      }),

      dependencies: [
        CsvService.Default
      ]

  }) { }