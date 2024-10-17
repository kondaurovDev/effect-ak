import { Array, Effect } from "effect";

import { ReasoningStructuredRequest } from "./schema.js";
import { ReasoningRequest, UserMessage } from "../text/index.js";
import { Text } from "../index.js";

export class ReasoningService
  extends Effect.Service<ReasoningService>()("ReasoningService", {
    effect:
      Effect.gen(function* () {

        const textService = yield* Text.TextService;

        const getPrompt = (
          request: ReasoningStructuredRequest
        ) =>
          `
            # Instruction
            ${request.mainInstruction}

            # Output

            - Must be provided in csv format
            - Use sign ';' for separating columns, Use double quotes for column values
            - Give the answer without table header, introduction words or markdown

            ## CSV columns:
            ${request.outputColumns.map((column, index) =>
              `${index + 1} - ${column.columnName} - ${column.description}`
            ).join("\n")}

            # Input requests (in json)
            ${JSON.stringify(request, undefined, 2)}
          `

        const getStructured = <O>(
          requestInput: ReasoningStructuredRequest
        ) =>
          textService.complete(
            ReasoningRequest.make({
              model: "o1-mini",
              messages: [
                UserMessage.make({
                  role: "user",
                  content: getPrompt(requestInput)
                })
              ]
            })
          ).pipe(
            Effect.andThen(_ => _.split("\n")),
            Effect.andThen(lines => 
              Array.reduce(
                lines,
                [] as Record<string, string | undefined>[],
                (result, currentLine) => {
                  const lineValues = currentLine.split(";");
                  const currentObject = new Map<string, string | undefined>();
                  const obj = requestInput.outputColumns.forEach((column, index) => {
                    const columnValue = lineValues.at(index);
                    return currentObject.set(column.columnName, columnValue?.slice(1, -1));
                  })
                  result.push(Object.fromEntries(currentObject.entries()));
                  return result;
                }
              )
            ),
          )

        return {
          getStructured
        } as const;

      }),

      dependencies: [
        Text.TextService.Default
      ]

  }) { }