import { Schema as S, JSONSchema } from "@effect/schema";
import { pipe, Effect } from "effect"

import { ToolChoice } from "../completion/request.js"

export type ToolSchema =
  typeof ToolSchema.Type

export const ToolSchema =
  S.Struct({
    type: S.Literal("function"),
    function: 
      S.Struct({
        name: S.NonEmptyString,
        description: S.NonEmptyString,
        parameters: S.Unknown
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
  functionSchema: S.Schema<F>
): Effect.Effect<ToolSchema, unknown> =>
  Effect.Do.pipe(
    Effect.bind("jsonSchema", () =>
      Effect.try(() =>
        JSONSchema.make(functionSchema)
      )
    ),
    Effect.bind("parts", ({ jsonSchema }) =>
      Effect.all({
        name: Effect.fromNullable(jsonSchema.title),
        description: Effect.fromNullable(jsonSchema.description),
        schema: Effect.fromNullable(jsonSchema)
      })
    ),
    Effect.andThen(({ parts }) => {
      return {
        type: "function",
        function: {
          name: parts.name,
          description: parts.description,
          parameters: parts.schema
        }
      }
    })
  )

export const getToolChoice = (
  functionName: string
): ToolChoice =>
  ({
    type: "function", 
    function: { name: functionName }
  });
