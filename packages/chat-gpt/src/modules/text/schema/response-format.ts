import * as S from "effect/Schema";;

export class StructuredResponseFormat extends
  S.Class<StructuredResponseFormat>("StructuredResponseFormat")({
    type: S.Literal("json_schema"),
    json_schema: 
      S.Struct({
        name: S.NonEmptyString,
        description: S.NonEmptyString,
        schema: S.Unknown,
        strict: S.Boolean
      })
  }) { }

export class TextOrJsonResponseFormat
  extends S.Class<TextOrJsonResponseFormat>("TextOrJsonResponseFormat")({
    type: S.Literal("text", "json_object")
  }) { }

export const OneOfResponseFormat =
  S.Union(
    StructuredResponseFormat,
    TextOrJsonResponseFormat,
  )
