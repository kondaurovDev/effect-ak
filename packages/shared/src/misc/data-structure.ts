import { Effect, pipe } from "effect";
import { Schema as S } from "@effect/schema";

import { Column, CsvService, CsvCompatibleObject } from "../data-format/index.js";
import { ChatCompletionService } from "../context/chat-completion.js";

export class DataStructureCommand
  extends S.Class<DataStructureCommand>("DataStructureCommand")({
    instruction: S.NonEmptyString,
    objects: CsvCompatibleObject.pipe(S.NonEmptyArray),
    inputColumns: Column.pipe(S.NonEmptyArray),
    ouputColumns: Column.pipe(S.NonEmptyArray),
  }) { };

export class DataStructureService
  extends Effect.Service<DataStructureService>()("DataStructureService", {
    effect:
      Effect.gen(function* () {

        const chatCompletionService = yield* ChatCompletionService;
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
            ${command.ouputColumns.map((column, index) =>
            `${index + 1} - ${column.columnName} - ${column.description}`
          ).join("\n")}
          `

        const getStructured = (
          command: DataStructureCommand
        ) =>
          pipe(
            Effect.succeed({
              systemMessage: makeSystemMessage(command),
              userMessage:
                csvService.encode({
                  columns: command.inputColumns, objects: command.objects
                })
            }),
            Effect.tap(Effect.logDebug),
            Effect.andThen(input =>
              Effect.tryPromise(() => chatCompletionService.complete(input))
            ),
            Effect.andThen(_ => csvService.decode({ columns: command.ouputColumns, lines: _.split("\n") }))
          );

        return {
          getStructured
        } as const;

      })

  }) { }