import { Match, pipe, Data } from "effect";

import { MessageUpdate } from "./message-update.js";
import { OriginUpdateEvent } from "./origin-update-event.js";
import { getUserName } from "./user.js";

export class MessageUpdateEvent 
  extends Data.TaggedClass("UpdateMessageEvent")<{
    chatId: number,
    source: "message" | "channel",
    authorId: string,
    updateId: number
    update: MessageUpdate
  }> {

    static fromOriginUpdate(input: typeof OriginUpdateEvent.Type) {
      return (
        pipe(
          Match.value(input),
          Match.when(({ message: Match.defined }), (messageUpdate) => 
            new MessageUpdateEvent({
              chatId: messageUpdate.message.chat.id,
              source: "message",
              authorId: getUserName(messageUpdate.message.from),
              updateId: messageUpdate.update_id,
              update: messageUpdate.message
            })
          ),
          Match.when(({ channel_post: Match.defined }), (channelUpdate) =>
            new MessageUpdateEvent({
              chatId: channelUpdate.channel_post.chat.id,
              source: "channel",
              authorId: getUserName(channelUpdate.channel_post.from),
              updateId: channelUpdate.update_id,
              update: channelUpdate.channel_post
            })
          ),
          Match.orElse(() => undefined)
        )      
      )
    } 

  }
