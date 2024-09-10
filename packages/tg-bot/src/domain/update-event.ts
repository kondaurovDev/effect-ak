import { Schema as S } from "@effect/schema";
import { Effect, Match, pipe, Cause } from "effect";

import { MessageUpdate } from "./message-update.js"
import { PreCheckoutQuery, SuccessfulPayment } from "./payment.js";
import { getUserName } from "./user.js";

export type TgUpdateEvent =
  typeof TgUpdateEvent.Type

export const TgUpdateEvent = 
  S.Struct({
    update_id: S.Number,
    message: S.optional(MessageUpdate),
    channel_post: S.optional(MessageUpdate),
    pre_checkout_query: S.optional(PreCheckoutQuery),
    successful_payment: S.optional(SuccessfulPayment)
  })

export const getMessageUpdate = (
  update: typeof TgUpdateEvent.Type
) =>
  pipe(
    Match.value(update),
    Match.when(({ message: Match.defined }), (messageUpdate) => 
      Effect.succeed({
        chatId: messageUpdate.message.chat.id,
        source: "message",
        authorId: getUserName(messageUpdate.message.from),
        updateId: messageUpdate.update_id,
        update: messageUpdate.message
      })
    ),
    Match.when(({ channel_post: Match.defined }), (channelUpdate) =>
      Effect.succeed({
        chatId: channelUpdate.channel_post.chat.id,
        source: "channel",
        authorId: getUserName(channelUpdate.channel_post.from),
        updateId: channelUpdate.update_id,
        update: channelUpdate.channel_post
      })
    ),
    Match.orElse(() => 
      Effect.fail(new Cause.NoSuchElementException)
    )
  )
