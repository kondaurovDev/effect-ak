import * as S from "effect/Schema";;

export const JsonSchema = 
  S.Record({ key: S.String, value: S.Unknown });

export const FunctionTool =
  S.Struct({
    type: S.Literal("function"),
    function: 
      S.Struct({
        name: S.NonEmptyString,
        description: S.NonEmptyString,
        parameters: JsonSchema
      })
  });

export const OneOfTool =
  S.Union(
    FunctionTool
  )

export type FunctionToolJsonSchema =
  typeof FunctionToolJsonSchema.Type

export const FunctionToolJsonSchema =
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    properties: S.Object
  })

export type ToolChoice =
  typeof ToolChoice.Type;

export const ToolChoice =
  S.Union(
    S.Literal("none"),
    S.Literal("auto"),
    S.Struct({
      type: S.Literal("function"),
      function:
        S.Struct({
          name: S.String
        })
    }),
  );