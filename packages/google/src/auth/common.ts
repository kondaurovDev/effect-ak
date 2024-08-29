import { Context, Brand } from "effect";

export type AccessTokenValue = string & Brand.Brand<"GoogleAccessTokenValue">
export const AccessTokenValue = Brand.nominal<AccessTokenValue>()

export const AccessToken =
  Context.GenericTag<AccessTokenValue>("GoogleAccessToken");
