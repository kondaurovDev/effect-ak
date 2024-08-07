import { Schema as S } from "~effect-schema";

// https://developers.notion.com/reference/parent-object

export type ParentSchema = S.Schema.Type<typeof ParentSchema>
export const ParentSchema = S.Union(
  S.Struct({
    type: S.Literal("page_id"),
    page_id: S.String
  }),
  S.Struct({
    type: S.Literal("workspace"),
    page_id: S.String
  }),
  S.Struct({
    type: S.Literal("database"),
    database_id: S.String
  }),
  S.Struct({
    type: S.Literal("block_id"),
    block_id: S.String
  }),
)
