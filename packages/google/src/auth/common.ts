import { Context } from "effect";

export class GoogleUserAccessToken
  extends Context.Tag("Google.UserAccessToken")<
    GoogleUserAccessToken, string
  >() { };
