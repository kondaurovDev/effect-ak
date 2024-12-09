import type { NormalTypeShape } from "./_model";

export const typeOverrides: Record<string, Record<string, NormalTypeShape>> = {
  Chat: {
    type: { typeNames: [ `"private" | "group" | "supergroup" | "channel"` ] }
  },
  sendMediaGroup: {
    media: { typeNames: [ "(T.InputMediaAudio | T.InputMediaDocument | T.InputMediaPhoto | T.InputMediaVideo)[]"] }
  }
} as const;
