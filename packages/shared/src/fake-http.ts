import { Effect, pipe } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform";

export const createClientJsonResponse = <B = unknown>(
  request: HttpClientRequest.HttpClientRequest,
  body: B,
  status: number = 200
) => pipe(
  Effect.try(() => new Response(JSON.stringify(body), {
    status,
    headers: new Headers({
      "Content-type": "application/json"
    }),
  })),
  Effect.andThen(response =>
    HttpClientResponse.fromWeb(request, response)
  ),
  Effect.orDie
);

export type ResponseFactory = {
  request: (
    request: HttpClientRequest.HttpClientRequest
  ) => unknown
}

export function createFakeClient(
  createResponse: ResponseFactory
) {
  return HttpClient.makeDefault((request) =>
    createClientJsonResponse(request, 
      createResponse.request(request)
    )
  );
}
