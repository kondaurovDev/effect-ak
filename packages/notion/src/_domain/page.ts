import { Schema as S } from "~effect-schema";
import { RichTextSchema } from "./rich-text"
import { DbColumn } from "./column"

export type PageSchema = S.Schema.Type<typeof PageSchema>

const CommonFields = S.Struct({
  id: S.NonEmpty,
  archived: S.Boolean,
  created_time: S.NonEmpty,
  last_edited_time: S.NonEmpty,
  icon: S.optional(S.Struct({
    type: S.optional(S.NonEmpty),
    emoj: S.optional(S.NonEmpty)
  })),
  url: S.NonEmpty
});

export const DatabasePage = 
  S.extend(CommonFields, S.Struct({
    object: S.Literal("database"),
    title: S.Array(RichTextSchema),
    description: S.Array(RichTextSchema),
    properties: S.Record(S.String, DbColumn),
    is_inline: S.Boolean,
  }));

export const PageSchema = S.Union(
  S.extend(CommonFields, S.Struct({
    object: S.Literal("page"),
  })),
);
