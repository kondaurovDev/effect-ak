import { Schema as S } from "@effect/schema";
import { Effect } from "effect";

import { MessageUpdate, getMessageUserName } from "./message.js"
import { UnknownTgUpdate } from "../error.js";

export type OriginalTgUpdateEvent =
  typeof OriginalTgUpdateEvent.Type;

export const OriginalTgUpdateEvent =
  S.Struct({
    update_id: S.Number,
    message: S.optional(MessageUpdate),
    channel_post: S.optional(MessageUpdate),
  });

const CommonFields =
  S.Struct({
    authorId: S.String,
    chatId: S.Number,
    updateId: S.Number,
    update: MessageUpdate
  })

export type TgUpdateEvent =
  typeof TgUpdateEvent.Type;

export const TgUpdateEvent =
  S.Union(
    S.extend(CommonFields,
      S.Struct({
        source: S.Literal("message"),
      })
    ),
    S.extend(CommonFields,
      S.Struct({
        source: S.Literal("channel"),
      })
    )
  )

export const handleOriginalTgUpdateEvent = (
  event: OriginalTgUpdateEvent
): Effect.Effect<TgUpdateEvent, UnknownTgUpdate> => {
  if (event.message) {
    return Effect.succeed({
      chatId: event.message.chat.id,
      source: "message",
      authorId: getMessageUserName(event.message),
      updateId: event.update_id,
      update: event.message
    })
  } else if (event.channel_post) {
    return Effect.succeed({
      chatId: event.channel_post.chat.id,
      source: "channel",
      authorId: getMessageUserName(event.channel_post),
      updateId: event.update_id,
      update: event.channel_post
    })
  } else {
    return new UnknownTgUpdate();
  }
}
