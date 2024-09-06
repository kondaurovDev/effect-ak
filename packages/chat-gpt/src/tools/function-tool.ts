import { Schema as S, JSONSchema } from "@effect/schema";
import { Effect, pipe } from "effect"

import { ToolChoice } from "../completion/request.js"

const Parameters = 
  S.Record({ key: S.String, value: S.Unknown });

export const ToolSchema =
  S.Struct({
    type: S.Literal("function"),
    function: 
      S.Struct({
        name: S.NonEmptyString,
        description: S.NonEmptyString,
        parameters: Parameters
      })
  });

export type FunctionToolSchema =
  typeof FunctionToolSchema.Type

export const FunctionToolSchema =
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    properties: S.Object
  })

export const getTool = <F>(
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
      S.validate(Parameters)(jsonSchema)
    ),

    Effect.andThen(({ parts, jsonSchemaObject }) => 
      ToolSchema.make({
        type: "function",
        function: {
          name: parts.name,
          description: parts.description,
          parameters: jsonSchemaObject
        }
      }))
  )

export const getToolChoice = (
  functionName: string
): ToolChoice =>
  ({
    type: "function", 
    function: { name: functionName }
  });
