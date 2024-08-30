import { Context, Brand } from "effect";

export type AccessTokenValue = string & Brand.Brand<"GoogleAccessTokenValue">
export const AccessTokenValue = Brand.nominal<AccessTokenValue>()

export class AccessToken
  extends Context.Tag("GoogleAccessToken")<
    AccessToken, AccessTokenValue
  >() { };
