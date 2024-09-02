import { describe, expect, it } from "vitest";

import { AuthResponse, getAuthUrl, GoogleOAuthClientCredentials, GoogleOAuthClientCredentialsContainer } from "../src/auth/oauth"
import { Effect, pipe, Redacted } from "effect";
import { Schema as S } from "@effect/schema"

describe("auth test suite", () => {

  const clientCredentials = 
    GoogleOAuthClientCredentialsContainer.make({
      clientId: "app.com",
      clientSecret: Redacted.make("superSecret"),
      redirectUri: "http://localhost",
      scopes: [
        "https://www.googleapis.com/auth/calendar.events"
      ]
    })

  it("get auth url", async () => {

    const authUrl =
      await pipe(
        getAuthUrl,
        Effect.provideService(GoogleOAuthClientCredentials, clientCredentials),
        Effect.runPromise
      )

    expect(authUrl).toBeDefined()
    
  })

  it("decode token", async () => {
    const actual =
      pipe(
        S.decodeUnknown(AuthResponse)({
          token_type: "Bearer",
          access_token: "asd",
          refresh_token: "zxc",
          expires_in: 1000,
          scope: ""
        }),
        Effect.runSync
      );

    expect(actual.access_token).toEqual("asd")
    expect(Redacted.value(actual.refresh_token!!)).toEqual("zxc")

  })


})