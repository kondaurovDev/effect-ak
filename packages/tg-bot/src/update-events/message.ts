import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import * as D from "../models/domain.js";

export const getMessageUserName = (
  message: Pick<MessageUpdate, "from">
) =>
  pipe(
    message.from.username ?? message.from.first_name,
    name => name.toLocaleLowerCase()
  )

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
    mime_type: S.optional(S.NonEmptyString)
  })

const messageFields = {
  message_id: S.Number,
  text: S.optional(S.NonEmptyString),
  photo: S.optional(PhotoArray),
  caption: S.optional(S.String),
  voice: S.optional(Voice),
  from: S.suspend(() => D.User),
  message_thread_id: S.optional(S.Number),
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
  }

export const MessageUpdate: S.Schema<MessageUpdate> = 
  S.Struct({
    ...messageFields,
    reply_to_message:
      S.optional(S.suspend(() => MessageUpdate))
  }).annotations({
    identifier: "MessageUpdate"
  })
