import { Schema as S } from "@effect/schema"

import { MessageUpdate } from "../domain/message-update.js";

export const ChatId = 
  S.Union(S.Number, S.String);


export const BotCommand =
  S.Struct({
    command: S.NonEmptyString,
    description: S.NonEmptyString
  })

export const WebhookInfo =
  S.Struct({
    url: S.String,
    pending_update_count: S.Number,
    last_error_date: S.optional(S.Number)
  }).annotations({
    identifier: "WebhookInfo"
  });

export const SetWebhookResult = S.Boolean
  .annotations({
    identifier: "SetWebhookResult"
  });

export const SetBotNameResult = S.Boolean
  .annotations({
    identifier: "SetBotNameResult"
  });

export const SetBotCommandsResult =
  S.Boolean
    .annotations({
      identifier: "SetMyCommandsResult"
    });

export const GetBotCommandsResult =
  S.Array(BotCommand)
    .annotations({
      identifier: "GetMyCommandsResult"
    });


export const UpdateMessageReplyMarkupResult =
  S.Union(
    S.Boolean,
    MessageUpdate
  ).annotations({
    identifier: "UpdateMessageReplyMarkupResult"
  });

export const SetChatActionResult =
  S.Boolean
    .annotations({
      identifier: "SendChatActionResult"
    });

export const FileInfo =
  S.Struct({
    file_id: S.String,
    file_unique_id: S.String,
    file_size: S.Number,
    file_path: S.String
  }).annotations({
    identifier: "FileInfo"
  });

export const Chat =
  S.Struct({
    id: S.Number,
    type: S.Literal("private", "group", "supergroup", "channel"),
    title: S.optional(S.String)
  }).annotations({
    identifier: "Chat"
  });

export const CommandScope =
  S.Union(
    S.Struct({
      type:
        S.Literal(
          "all_private_chats", "default", "all_group_chats",
          "all_chat_administrators"
        ),
    }),
    S.Struct({
      type: S.Literal(
        "chat", "chat_administrators"
      ),
      chat_id: ChatId
    }),
    S.Struct({
      type: S.Literal(
        "chat_member"
      ),
      chat_id: ChatId,
      user_id: S.Number
    }),
  )

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

  
// https://core.telegram.org/bots/api#inlinekeyboardbutton
// Exactly one of the optional fields must be used to specify type of the button.
export const InlineKeyboardButton =
  S.Struct({
    text: S.String,
    url: S.optional(S.String),
    web_app: S.optional(WebApp),
    callback_data: S.optional(S.String),
    switch_inline_query: S.optional(S.String),
    switch_inline_query_current_chat: S.optional(S.String),
    switch_inline_query_chosen_chat: S.optional(SwitchInlineQueryChosenChat)
  }).annotations({
    identifier: "InlineKeyboardButton"
  })
