export const typeOverrides: Record<string, Record<string, string>> = {
  Chat: {
    type: `"private" | "group" | "supergroup" | "channel"`
  }
};

export const returnTypeOverrides: Record<string, string> = {
  copyMessage: "MessageId",
  getUserProfilePhotos: "UserProfilePhotos",
  getFile: "File"
}
