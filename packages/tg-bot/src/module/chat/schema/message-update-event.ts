import { pipe } from "effect/Function";
import * as Data from "effect/Data";

import { MessageUpdate } from "./message-update.js";
import { OriginUpdateEvent } from "./origin-update-event.js";
import { ChatId, User } from "../schema.js";

type MessageSource = "channel" | "group";

export const getUserName = (
  from: typeof User.Type | undefined
) =>
  pipe(
    from?.username ?? from?.first_name ?? "anonym",
    name => name.toLocaleLowerCase()
  )

export class MessageUpdateEvent 
  extends Data.TaggedClass("UpdateMessageEvent")<{
    chatId: ChatId,
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
          chatId: ChatId.make(update.chat.id),
          authorId: getUserName(update.from),
          updateId, update, isEdited, source
        })
      )
    }

    static fromOriginUpdateEvent(input: OriginUpdateEvent) {

      if (input.message) {
        return (
          MessageUpdateEvent.fromMessageUpdateEvent(
            input.message, "group", input.update_id, false, 
          )
        )
      } else if (input.edited_message) {
        return (
          MessageUpdateEvent.fromMessageUpdateEvent(
            input.edited_message, "group", input.update_id, true
          )
        )
      } else if (input.channel_post) {
        return (
          MessageUpdateEvent.fromMessageUpdateEvent(
            input.channel_post, "channel", input.update_id, false
          )
        )
      } else if (input.edited_channel_post) {
        return (
          MessageUpdateEvent.fromMessageUpdateEvent(
            input.edited_channel_post, "channel", input.update_id, true
          )
        )
      } else {
        return undefined;
      }
    } 

  }
