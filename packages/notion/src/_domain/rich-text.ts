import { Brand } from "~effect";
import { Schema as S } from "~effect-schema";

// https://developers.notion.com/reference/rich-text

export type RichText = S.Schema.Type<typeof RichTextSchema> & Brand.Brand<"RichText">;
export const RichText = Brand.nominal<RichText>();

const CommonSchema = S.Struct({
  annotations: S.optional(S.Struct({
    bold: S.Boolean,
    italic: S.Boolean,
    strikethrough: S.Boolean,
    underline: S.Boolean,
    code: S.Boolean,
    color: S.Literal(
      "blue", "blue_background", "brown", "brown_background", "default",
      "gray", "gray_background", "green", "green_background",
      "orange", "orange_background", "pink", "pink_background", "purple",
      "purple_background", "red", "red_background", "yellow", "yellow_background"
    ),
  })),
  plain_text: S.optional(S.String),
  href: S.optional(S.String)
});

const MentionSchema = S.Union(
  S.extend(CommonSchema, S.Struct({
    type: S.Literal("mention"),
    mention: S.Union(
      S.Struct({
        type: S.Literal("user"),
        user: S.Struct({
          object: S.Literal("user"),
          id: S.String,
        })
      }),
      S.Struct({
        type: S.Literal("database"),
        database: S.Struct({
          id: S.String,
        })
      }),
      S.Struct({
        type: S.Literal("date"),
        date: S.Struct({
          start: S.String,
          end: S.optional(S.String),
          timezone: S.optional(S.String)
        })
      }),
      S.Struct({
        type: S.Literal("link_preview"),
        link_preview: S.Struct({
          url: S.String,
        })
      }),
      S.Struct({
        type: S.Literal("page"),
        page: S.Struct({
          url: S.String,
        })
      }),
      S.Struct({
        type: S.Literal("template_mention"),
        template_mention: S.Union(
          S.Struct({
            type: S.Literal("template_mention_date"),
            template_mention_date: S.Literal("today", "now"),
          }),
          S.Struct({
            type: S.Literal("template_mention_user"),
            template_mention_user: S.Literal("me"),
          })
        )
      }),
    )
  }))
)

export const RichTextSchema = S.Union(
  S.extend(CommonSchema, S.Struct({
    type: S.Literal("text"),
    text: S.Struct({
      content: S.String,
      link: S.optional(S.Struct({
        link: S.NonEmpty
      }))
    })
  })),
  S.extend(CommonSchema, S.Struct({
    type: S.Literal("equation"),
    equation: S.Struct({
      expression: S.String,
    })
  })),
  MentionSchema
)
