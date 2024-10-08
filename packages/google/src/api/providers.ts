import { Context, Data, Effect, pipe } from "effect";
import { ParseResult, Schema as S } from "@effect/schema"
import type { PlatformError } from "@effect/platform/Error";
import { FileSystem, Path } from "@effect/platform";

import { GoogleUserAccessToken, OAuth2ClientCredentials } from "./schema.js";

export class GoogleUserAccessTokenProvider
  extends Context.Tag("Google.UserAccessTokenProvider")<
    GoogleUserAccessTokenProvider, GoogleUserAccessToken
  >() { };

export class OAuth2ClientCredentialsProviderError
  extends Data.TaggedError("OAuth2ClientCredentialsProviderError")<{
    code: "from_file_error",
    cause: PlatformError | ParseResult.ParseError
  }> { }

export class OAuth2ClientCredentialsProvider
  extends Context.Tag(`Google.OAuth2ClientCredentialsProvider`)<
    OAuth2ClientCredentialsProvider, {
      readonly credentials: OAuth2ClientCredentials
    }
  >() {

  static fromValue(credentials: OAuth2ClientCredentials) {
    return Effect.succeed(credentials)
  }

  static fromLocalFile(
    filePath: (path: Path.Path) => string
  ) {

    return Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;

      const credentials =
        yield* pipe(
          fs.readFileString(filePath(path)),
          Effect.andThen(S.decodeUnknown(S.parseJson(OAuth2ClientCredentials))),
          Effect.mapError(error =>
            new OAuth2ClientCredentialsProviderError({
              code: "from_file_error",
              cause: error
            })
          )
        );

      return OAuth2ClientCredentialsProvider.of({
        credentials
      });

    });

  }

}
