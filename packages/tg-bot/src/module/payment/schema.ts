import * as S from "effect/Schema";

import { User, ChatId } from "../chat/schema.js";

// https://core.telegram.org/bots/payments-stars#step-by-step-process

export const InvoicePrice = 
  S.Struct({
    label: S.String,
    amount: S.Number
  });

export const SendStarsInvoice = 
  S.Struct({
    chat_id: ChatId,
    title: S.NonEmptyString,
    payload: S.NonEmptyString,
    description: S.NonEmptyString,
    provider_token: S.Literal(""),
    currency: S.Literal("XTR"),
    prices: S.NonEmptyArray(InvoicePrice),
    suggested_tip_amounts: S.NonEmptyArray(S.Positive).pipe(S.optional),
    start_parameter: S.String.pipe(S.optional)
  });

export const AnswerPreCheckoutQuery = 
  S.Struct({
    pre_checkout_query_id: S.NonEmptyString,
    ok: S.Boolean,
    error_message: S.optional(S.NonEmptyString)
  });

// https://core.telegram.org/bots/api#precheckoutquery
export const PreCheckoutQuery = 
  S.Struct({
    id: S.NonEmptyString,
    from: User,
    currency: S.String,
    total_amount: S.Positive,
    invoice_payload: S.String
  });

// https://core.telegram.org/bots/api#successfulpayment
export const SuccessfulPayment = 
  S.Struct({
    currency: S.String,
    total_amount: S.Number,
    invoice_payload: S.String,
    telegram_payment_charge_id: S.String,
    provider_payment_charge_id: S.String
  });
