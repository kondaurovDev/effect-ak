import { Schema as S } from "@effect/schema"
import { Effect, pipe } from "effect";

import { ChatId } from "../domain/chat.js";
import { ParseMode, ReplyParameters } from "../domain/message.js";
import { TgBotHttpClient } from "../api/index.js";
import { MessageUpdate } from "../domain/message-update.js";

export const SendVoiceInput = 
  S.Struct({
    chat_id: ChatId,
    parse_mode: S.UndefinedOr(ParseMode),
    reply_parameters: ReplyParameters,
    caption: S.UndefinedOr(S.String),
    voice: 
      S.Union(
        S.Uint8Array,
        S.String
      )
  });

export const sendVoice = (
  input: typeof SendVoiceInput.Type
) =>
  pipe(
    TgBotHttpClient,
    Effect.andThen(client =>
      client.executeMethod(
        "/sendVoice",
        input,
        MessageUpdate
      )
    )
  )