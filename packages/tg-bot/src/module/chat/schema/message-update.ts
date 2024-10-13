import { Schema as S } from "@effect/schema";

import { ReplyMarkup } from "./reply-markup.js";
import { User } from "../schema.js";

export class MessageUpdate
  extends S.Class<MessageUpdate>("MessageUpdate")({
    message_id: S.Number,
    date: S.Number,
    chat: S.suspend(() => Chat),
    reply_to_message: S.optional(S.suspend((): S.Schema<MessageUpdate> => MessageUpdate)),
    from: S.optional(S.suspend(() => User)),
    text: S.optional(S.String),
    photo: S.optional(S.suspend(() => S.Array(MessageFile))),
    voice: S.optional(S.suspend(() => MessageFile)),
    document: S.optional(S.suspend(() => MessageFile)),
    media_group_id: S.optional(S.String),
    effect_id: S.optional(S.String),
    caption: S.optional(S.String),
    message_thread_id: S.optional(S.Number),
    reply_markup: S.optional(ReplyMarkup),
    forward_from: S.optional(S.suspend((): S.Schema<MessageUpdate> => MessageUpdate)),
    forward_origin: S.optional(S.suspend((): S.Schema<MessageUpdate> => MessageUpdate))
  }) { }

export type Chat = typeof Chat.Type
export const Chat =
  S.Struct({
    id: S.Number,
    username: S.optional(S.NonEmptyString),
    first_name: S.optional(S.NonEmptyString),
    type: S.Literal("group", "private", "channel", "supergroup")
  })

export type MessageFile = typeof MessageFile.Type
export const MessageFile = 
  S.Struct({
    file_id: S.String,
    file_unique_id: S.String,
    file_size: S.optional(S.Number),
    mime_type: S.optional(S.String),
    duration: S.optional(S.Number)
  })
