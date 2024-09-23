import { Schema as S } from "@effect/schema"
import { Effect, pipe } from "effect";

import { ChatId } from "../domain/chat.js";
import { ParseMode, ReplyParameters } from "../domain/message.js";
import { TgRestClient } from "../client/tag.js";
import { MessageUpdate } from "../domain/message-update.js";

export const SendVoiceInput = 
  S.Struct({
    chat_id: ChatId,
    parse_mode: S.optional(ParseMode),
    reply_parameters: ReplyParameters,
    caption: S.optional(S.String),
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
    TgRestClient,
    Effect.andThen(client =>
      client.execute(
        "/sendVoice",
        input,
        MessageUpdate
      )
    )
  )