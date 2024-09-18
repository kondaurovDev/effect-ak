import { Schema as S } from "@effect/schema";

import { MessageUpdate } from "./message-update.js"
import { PreCheckoutQuery, SuccessfulPayment } from "./payment.js";

export type OriginUpdateEvent =
  typeof OriginUpdateEvent.Type

/**
 * This object represents an incoming update.
 * At most one of the optional parameters can be present in any given update.
 */

export const OriginUpdateEvent =
  S.Struct({
    update_id: S.Number,
    message: S.optional(MessageUpdate),
    edited_message: S.optional(MessageUpdate),
    channel_post: S.optional(MessageUpdate),
    edited_channel_post: S.optional(MessageUpdate),
    pre_checkout_query: S.optional(PreCheckoutQuery),
    successful_payment: S.optional(SuccessfulPayment)
  })

export const UpdateEventType =
  S.keyof(OriginUpdateEvent.pipe(S.omit("update_id")))