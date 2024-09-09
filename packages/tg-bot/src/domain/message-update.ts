import { Schema as S } from "@effect/schema";
import { pipe } from "effect";
import { ReplyMarkup } from "./reply-markup.js";

const messageFields = {
  message_id: S.Number, // Unix time
  date: S.Number,
  text: S.optional(S.NonEmptyString),
  photo: S.optional(S.suspend(() => PhotoArray)),
  caption: S.optional(S.String),
  voice: S.optional(S.suspend(() => Voice)),
  from: S.optional(S.suspend(() => User)),
  message_thread_id: S.optional(S.Number),
  reply_markup: S.optional(ReplyMarkup),
  chat: S.Struct({
    id: S.Number,
    username: S.optional(S.NonEmptyString),
    first_name: S.optional(S.NonEmptyString),
    type: S.Literal("group", "private", "channel", "supergroup" )
  }),
}

export interface MessageUpdate 
  extends S.Struct.Type<typeof messageFields> {
    reply_to_message?: MessageUpdate | undefined
    forward_from?: MessageUpdate | undefined
    forward_origin?: MessageUpdate | undefined
  }

export const MessageUpdate: S.Schema<MessageUpdate> = 
  S.Struct({
    ...messageFields,
    reply_to_message: S.optional(S.suspend(() => MessageUpdate)),
    forward_from: S.optional(S.suspend(() => MessageUpdate)),
    forward_origin: S.optional(S.suspend(() => MessageUpdate))
  }).annotations({
    identifier: "MessageUpdate"
  })

export const getMessageUserName = (
  message: Pick<MessageUpdate, "from">
) =>
  pipe(
    message.from?.username ?? message.from?.first_name ?? "anonym",
    name => name.toLocaleLowerCase()
  )

const PhotoArray = 
  S.Array(
    S.Struct({
      file_id: S.String,
      file_size: S.optional(S.Number)
    })
  );

export const User =
  S.Struct({
    id: S.Number,
    first_name: S.NonEmptyString,
    username: S.optional(S.NonEmptyString),
    is_bot: S.Boolean
  }).annotations({
    identifier: "TgUser"
  });

const Voice =
  S.Struct({
    file_id: S.String,
    file_unique_id: S.String,
    duration: S.Number,
    mime_type: S.optional(S.NonEmptyString)
  })
