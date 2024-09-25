import { Schema as S } from "@effect/schema";

import { ReplyMarkup } from "./reply-markup.js";
import { User } from "./user.js";

export class MessageUpdate
  extends S.Class<MessageUpdate>("MessageUpdate")({
    message_id: S.Number, // Unix time
    date: S.Number,
    chat: S.suspend(() => Chat),
    media_group_id: S.UndefinedOr(S.String),
    effect_id: S.UndefinedOr(S.String),
    text: S.UndefinedOr(S.String),
    photo: S.UndefinedOr(S.suspend(() => S.Array(MessageFile))),
    document: S.UndefinedOr(S.suspend(() => MessageFile)),
    caption: S.UndefinedOr(S.String),
    voice: S.UndefinedOr(S.suspend(() => MessageFile)),
    from: S.UndefinedOr(S.suspend(() => User)),
    message_thread_id: S.UndefinedOr(S.Number),
    reply_markup: S.UndefinedOr(ReplyMarkup),
    reply_to_message: S.UndefinedOr(S.suspend((): S.Schema<MessageUpdate> => MessageUpdate)),
    forward_from: S.UndefinedOr(S.suspend((): S.Schema<MessageUpdate> => MessageUpdate)),
    forward_origin: S.UndefinedOr(S.suspend((): S.Schema<MessageUpdate> => MessageUpdate))
  }) { }

export type Chat = typeof Chat.Type
export const Chat =
  S.Struct({
    id: S.Number,
    username: S.UndefinedOr(S.NonEmptyString),
    first_name: S.UndefinedOr(S.NonEmptyString),
    type: S.Literal("group", "private", "channel", "supergroup")
  })

export type MessageFile = typeof MessageFile.Type
export const MessageFile = 
  S.Struct({
    file_id: S.String,
    file_unique_id: S.String,
    file_size: S.UndefinedOr(S.Number),
    mime_type: S.UndefinedOr(S.String),
    duration: S.UndefinedOr(S.Number)
  })

