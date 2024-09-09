import { Schema as S } from "@effect/schema"

export const ReplyMarkup =
  S.suspend(() =>
    S.Struct({
      inline_keyboard: 
        S.Array(
          S.Array(InlineKeyboardButton)
        )
    }).annotations({
      identifier: "ReplyMarkup"
    })
  )

// https://core.telegram.org/bots/api#inlinekeyboardbutton
// Exactly one of the optional fields must be used to specify type of the button.
export const InlineKeyboardButton =
  S.Struct({
    text: S.String,
    url: S.optional(S.String),
    web_app: S.optional(S.suspend(() => WebApp)),
    callback_data: S.optional(S.String),
    switch_inline_query: S.optional(S.String),
    switch_inline_query_current_chat: S.optional(S.String),
    switch_inline_query_chosen_chat: S.optional(S.suspend(() => SwitchInlineQueryChosenChat))
  }).annotations({
    identifier: "InlineKeyboardButton"
  })

const WebApp =
  S.Struct({
    url: S.String
  }).annotations({
    identifier: "WebApp"
  })

const SwitchInlineQueryChosenChat =
  S.Struct({
    query: S.optional(S.String),
    allow_user_chats: S.optional(S.Boolean),
    allow_bot_chats: S.optional(S.Boolean),
    allow_group_chats: S.optional(S.Boolean),
    allow_channel_chats: S.optional(S.Boolean),
  }).annotations({
    identifier: "SwitchInlineQueryChosenChat"
  })
