![NPM Version](https://img.shields.io/npm/v/@effect-ak/tg-bot)

## Example

Building a telegram bot should be simple like:

```typescript
import { MessageHandler } from "@effect-ak/tg-bot";

export const messageHandler: MessageHandler =
  async ({ message, currentChatId, service }) => {

    if (message.text == "/dice") {
      return service.chat.sendDice({
        chat_id: currentChatId,
        emoji: "🏀"
      });
    }

    if (message.text == "/start") {
      const botInfo =
        await service.botSettings.getMe.promise();

      return service.chat.sendMessage({
        chat_id: currentChatId,
        text: `Hello, ${message.from?.first_name}. My name is ${botInfo.first_name}. Let's talk! :)`,
        message_effect_id: "🔥"
      });
    }

    return service.chat.sendMessage({
      chat_id: currentChatId,
      reply_parameters: {
        chat_id: currentChatId,
        message_id: message.message_id
      },
      text: "I don't know how to reply on that",
      message_effect_id: "💩"
    });

  }
```