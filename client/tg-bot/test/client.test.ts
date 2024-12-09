import { describe, expect, assert, vi } from "vitest";

import { fixture } from "./fixture";

const fetchSpy = vi.spyOn(global, "fetch");

describe("telegram bot client", () => {

  fixture("send dice", async ({ client, chat_id, skip }) => {

    skip();

    const response =
      await client.execute("send_dice", {
        chat_id,
        emoji: "🎲"
      });

    const url = fetchSpy.mock.calls[0][0] as string;
    const lastPath = url.split('/').pop();

    expect(lastPath).toEqual("sendDice");

    assert(response != null);

    expect(response.result?.chat.id).toBeDefined();
  });

  fixture("send message", async ({ chat_id, client, skip }) => {

    skip();

    const response =
      await client.execute("send_message", {
        chat_id,
        text: "hey again",
        message_effect_id: ""
      })

    expect(response.result?.chat.id).toBeDefined();

  });


})