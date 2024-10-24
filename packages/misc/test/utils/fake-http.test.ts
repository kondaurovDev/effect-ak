import { describe, it, expect, vi } from "vitest"
import { Effect, Layer, pipe } from "effect";
import { HttpClient, HttpClientRequest, HttpBody } from "@effect/platform";

import { ResponseFactory, createFakeClient } from "../../src/utils";

describe("client suite", () => {

  const responseFactory: ResponseFactory = {
    request: (request) => {
      console.log(`url: ${request.url}`)
      return {
        bla: "bla"
      }
    }
  }

  const fakeHttpClient = pipe(
    createFakeClient(responseFactory),
    client => client.pipe(
      HttpClient.mapRequest(
        HttpClientRequest.prependUrl("https://telega.com")
      ),
      HttpClient.mapRequest(
        HttpClientRequest.setHeaders({
          "Authorization": "Bearer 123"
        })
      ),
    )
  );

  vi.spyOn(responseFactory, "request");

  it("should send request", async () => {

    const program = pipe(
      HttpClient.HttpClient,
      Effect.andThen(client =>
        client(HttpClientRequest.post("/api", {
          body: HttpBody.unsafeJson({ action: "doit" })
        }))
      ),
      Effect.andThen(_ => _.json)
    );

    const actual = await pipe(
      program,
      Effect.provide(
        Layer.succeed(HttpClient.HttpClient, fakeHttpClient)
      ),
      Effect.scoped,
      Effect.runPromise
    );

    expect(actual).toEqual({ bla: "bla" });

    expect(responseFactory.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          authorization: "Bearer 123"
        }),
        url: "https://telega.com/api"
      })
    );
    
  })

})