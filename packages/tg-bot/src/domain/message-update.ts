import { Schema as S } from "@effect/schema";

import { ReplyMarkup } from "./reply-markup.js";
import { User } from "./user.js";

export class MessageUpdate
  extends S.Class<MessageUpdate>("MessageUpdate")({
    message_id: S.Number, // Unix time
    date: S.Number,
    media_group_id: S.UndefinedOr(S.String),
    effect_id: S.optional(S.String),
    text: S.optional(S.String),
    photo: S.optional(S.suspend(() => PhotoArray)),
    caption: S.optional(S.String),
    voice: S.optional(S.suspend(() => Voice)),
    from: S.optional(S.suspend(() => User)),
    message_thread_id: S.optional(S.Number),
    reply_markup: S.optional(ReplyMarkup),
    chat:
      S.Struct({
        id: S.Number,
        username: S.optional(S.NonEmptyString),
        first_name: S.optional(S.NonEmptyString),
        type: S.Literal("group", "private", "channel", "supergroup" )
      }),
    reply_to_message: S.UndefinedOr(S.suspend((): S.Schema<MessageUpdate> => MessageUpdate)),
    forward_from: S.optional(S.suspend((): S.Schema<MessageUpdate> => MessageUpdate)),
    forward_origin: S.optional(S.suspend((): S.Schema<MessageUpdate> => MessageUpdate))
  }) {}

const PhotoArray = 
  S.Array(
    S.Struct({
      file_id: S.String,
      file_size: S.optional(S.Number)
    })
  );

const Voice =
  S.Struct({
    file_id: S.String,
    file_unique_id: S.String,
    duration: S.Number,
    mime_type: S.optional(S.String)
  })
