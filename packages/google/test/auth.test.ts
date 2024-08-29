import { describe, expect, it } from "vitest";

import { getAuthUrl, ClientCredentials, ClientCredentialsValue } from "../src/auth/oauth"
import { Effect, pipe } from "effect";

describe("auth test suite", () => {

  it("get auth url", async () => {

    const clientCredentials = 
      ClientCredentialsValue.make({
        clientId: "916217733835-2v3c48lqbq5j1hl16lmlutgo375pf49f.apps.googleusercontent.com",
        clientSecret: "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",
        redirectUri: "http://localhost",
        scopes: [
          "https://www.googleapis.com/auth/calendar.events"
        ]
      })

    const authUrl =
      await pipe(
        getAuthUrl,
        Effect.provideService(ClientCredentials, clientCredentials),
        Effect.runPromise
      )

    expect(authUrl).toBeDefined()
    
  })


})