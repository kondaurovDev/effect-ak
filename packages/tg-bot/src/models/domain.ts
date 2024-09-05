import { Schema as S } from "@effect/schema"
import { MessageUpdate } from "../domain/index.js";

type Infer<T> = S.Schema.Type<T>

export type ChatId =
  typeof ChatId;

export const ChatId = S.Union(S.Number, S.String);

export type User =
  typeof User.Type;

export const User =
  S.Struct({
    id: S.Number,
    first_name: S.NonEmptyString,
    username: S.optional(S.NonEmptyString),
    is_bot: S.Boolean
  }).annotations({
    identifier: "TgUser"
  });

export const BotCommand =
  S.Struct({
    command: S.NonEmptyString,
    description: S.NonEmptyString
  })

export type WebhookInfo =
  typeof WebhookInfo.Type;

export const WebhookInfo =
  S.Struct({
    url: S.String,
    pending_update_count: S.Number,
    last_error_date: S.optional(S.Number)
  }).annotations({
    identifier: "WebhookInfo"
  });

export type SetWebhookResult = Infer<typeof SetWebhookResult>;
export const SetWebhookResult = S.Boolean
  .annotations({
    identifier: "SetWebhookResult"
  });

export type SetBotNameResult = Infer<typeof SetBotNameResult>;
export const SetBotNameResult = S.Boolean
  .annotations({
    identifier: "SetBotNameResult"
  });

export type SetBotCommandsResult = Infer<typeof SetBotCommandsResult>;
export const SetBotCommandsResult =
  S.Boolean
    .annotations({
      identifier: "SetMyCommandsResult"
    });

export type GetBotCommandsResult = Infer<typeof GetBotCommandsResult>;
export const GetBotCommandsResult =
  S.Array(BotCommand)
    .annotations({
      identifier: "GetMyCommandsResult"
    });


export type UpdateMessageReplyMarkupResult = Infer<typeof UpdateMessageReplyMarkupResult>;
export const UpdateMessageReplyMarkupResult =
  S.Union(
    S.Boolean,
    S.suspend(() => MessageUpdate)
  ).annotations({
    identifier: "UpdateMessageReplyMarkupResult"
  });

export type SetChatActionResult = Infer<typeof SetChatActionResult>;
export const SetChatActionResult =
  S.Boolean
    .annotations({
      identifier: "SendChatActionResult"
    });

export type FileInfo = Infer<typeof FileInfo>;
export const FileInfo =
  S.Struct({
    file_id: S.String,
    file_unique_id: S.String,
    file_size: S.Number,
    file_path: S.String
  }).annotations({
    identifier: "FileInfo"
  });

export type Chat = Infer<typeof Chat>;
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

// https://core.telegram.org/bots/api#inlinekeyboardbutton
export const InlineKeyboardButton =
  S.partial(
    S.Struct({
      text: S.required(S.String),
      url: S.String,
      web_app: S.suspend(() => WebApp),
      callback_data: S.String,
      switch_inline_query: S.String,
      switch_inline_query_current_chat: S.String,
      switch_inline_query_chosen_chat:
        S.suspend(() => SwitchInlineQueryChosenChat)
    })
  ).annotations({
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
