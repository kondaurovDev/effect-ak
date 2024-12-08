import type { NormalTypeShape } from "./_model";

export const typeOverrides: Record<string, Record<string, NormalTypeShape>> = {
  Chat: {
    type: { typeNames: ["private", "group", "supergroup", "channel" ] }
  }
};

export const returnTypeOverrides: Record<string, string> = {
  copyMessage: "MessageId",
  getUserProfilePhotos: "UserProfilePhotos",
  getFile: "File"
}
