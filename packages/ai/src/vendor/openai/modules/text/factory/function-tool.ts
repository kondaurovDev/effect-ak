import { Effect, pipe, JSONSchema } from "effect";
import * as S from "effect/Schema";

import { JsonSchema, OneOfTool, ToolChoice } from "../schema/tool.js";

export const makeToolChoice = (
  functionName: string
): ToolChoice =>
  ({
    type: "function", 
    function: { name: functionName }
  });

export const makeFunctionTool = <F>(
  schemaName: string,
  functionSchema: S.Schema<F>
) =>
  pipe(
    Effect.Do,
    Effect.bind("jsonSchema", () => 
      Effect.try(() => JSONSchema.make(functionSchema))
    ),
    Effect.bind("parts", ({ jsonSchema }) =>
      Effect.all({
        name: Effect.fromNullable(jsonSchema.title),
        description: Effect.fromNullable(jsonSchema.description),
      })
    ),
    Effect.catchTag("NoSuchElementException", () => 
      Effect.fail(`title, description must be defined for schema '${schemaName}'`)
    ),
    Effect.bind("jsonSchemaObject", ({ jsonSchema }) => 
      S.validate(JsonSchema)(jsonSchema)
    ),
    Effect.andThen(({ parts, jsonSchemaObject }) => 
      OneOfTool.make({
        type: "function",
        function: {
          name: parts.name,
          description: parts.description,
          parameters: jsonSchemaObject
        }
      }))
  )
