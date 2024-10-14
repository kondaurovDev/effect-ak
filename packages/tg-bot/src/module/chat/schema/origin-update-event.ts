import { Schema as S } from "@effect/schema";

import { MessageUpdate } from "./message-update.js"
import { PreCheckoutQuery, SuccessfulPayment } from "../../payment/schema.js";

export type UpdateId = typeof UpdateId.Type
export const UpdateId = S.Number.pipe(S.brand("UpdateId"))

/**
 * This object represents an incoming update.
 * At most one of the optional parameters can be present in any given update.
 */

export class OriginUpdateEvent
  extends S.Class<OriginUpdateEvent>("OriginUpdateEvent")({
    update_id: UpdateId,
    message: S.optional(MessageUpdate),
    edited_message: S.optional(MessageUpdate),
    channel_post: S.optional(MessageUpdate),
    edited_channel_post: S.optional(MessageUpdate),
    pre_checkout_query: S.optional(PreCheckoutQuery),
    successful_payment: S.optional(SuccessfulPayment)
  }) { }

export const UpdateEventType =
  S.keyof(OriginUpdateEvent.pipe(S.omit("update_id")))