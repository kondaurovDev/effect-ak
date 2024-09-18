import { Match, pipe, Data } from "effect";

import { MessageUpdate } from "./message-update.js";
import { OriginUpdateEvent } from "./origin-update-event.js";
import { getUserName } from "./user.js";

type MessageSource = "channel" | "group";

export class MessageUpdateEvent 
  extends Data.TaggedClass("UpdateMessageEvent")<{
    chatId: number,
    source: MessageSource,
    authorId: string,
    updateId: number
    update: MessageUpdate,
    isEdited: boolean
  }> {

    private static fromMessageUpdateEvent(
      update: MessageUpdate,
      source: MessageSource,
      updateId: number,
      isEdited: boolean
    ) {
      return (
        new MessageUpdateEvent({
          chatId: update.chat.id,
          authorId: getUserName(update.from),
          updateId, update, isEdited, source
        })
      )
    }

    static fromOriginUpdateEvent(input: OriginUpdateEvent) {
      return (
        pipe(
          Match.value(input),
          Match.when(({ message: Match.defined }), ({ message }) => 
            MessageUpdateEvent.fromMessageUpdateEvent(
              message, "group", input.update_id, false, 
            )
          ),
          Match.when(({ edited_message: Match.defined }), ({ edited_message }) => 
            MessageUpdateEvent.fromMessageUpdateEvent(
              edited_message, "group", input.update_id, true
            )
          ),
          Match.when(({ channel_post: Match.defined }), ({ channel_post }) =>
            MessageUpdateEvent.fromMessageUpdateEvent(
              channel_post, "channel", input.update_id, false
            )
          ),
          Match.when(({ edited_channel_post: Match.defined }), ({ edited_channel_post }) =>
            MessageUpdateEvent.fromMessageUpdateEvent(
              edited_channel_post, "channel", input.update_id, true
            )
          ),
          Match.orElse(() => undefined)
        )      
      )
    } 

  }
