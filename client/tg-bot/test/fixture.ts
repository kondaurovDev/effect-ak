import { test } from "vitest";

import { makeTgBotClient, TgBotClient } from "../src/client/factory";

type Fixture = {
  readonly client: TgBotClient
  readonly chat_id: string
};

export const fixture = test.extend<Fixture>(({
  client: async ({ }, use) => {

    const token = process.env["bot-token"];
    if (!token) throw Error("bot-token not defined in config.json");

    const client =
      makeTgBotClient({
        token
      });
    use(client);
  },
  chat_id: async ({}, use) => {
    const chatId = process.env["chat-id"];
    if (!chatId) throw Error("chat-id not defined in config.json");
    use(chatId)
  }
}));
