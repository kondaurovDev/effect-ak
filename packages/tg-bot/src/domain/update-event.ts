import { Schema as S } from "@effect/schema";
import { Effect } from "effect";

import { MessageUpdate, getMessageUserName } from "./message-update.js"
import { UnknownTgUpdate } from "./error.js";

export class TgUpdateEvent 
  extends S.Class<TgUpdateEvent>("TgUpdateEvent")({
    update_id: S.Number,
    message: S.optional(MessageUpdate),
    channel_post: S.optional(MessageUpdate),
  }) {
  
    get updateEffect() {
      if (this.message) {
        return Effect.succeed({
          chatId: this.message.chat.id,
          source: "message",
          authorId: getMessageUserName(this.message),
          updateId: this.update_id,
          update: this.message
        })
      } else if (this.channel_post) {
        return Effect.succeed({
          chatId: this.channel_post.chat.id,
          source: "channel",
          authorId: getMessageUserName(this.channel_post),
          updateId: this.update_id,
          update: this.channel_post
        })
      } else {
        return new UnknownTgUpdate();
      }
    }

  }
