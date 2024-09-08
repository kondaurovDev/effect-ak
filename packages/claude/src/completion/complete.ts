import { Effect, pipe } from "effect";
import { Schema as S } from "@effect/schema"
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { ClaudeRestClient } from "../client.js";
import { MessageResponse } from "./response.js";
import { CreateMessageRequest } from "./request.js";

export const complete = (
  request: CreateMessageRequest
) =>
  pipe(
    Effect.Do,
    Effect.bind("client", () => ClaudeRestClient),
    Effect.bind("requestBody", () =>
      HttpBody.json(request)
    ),
    Effect.bind("result", ({ client, requestBody }) =>
      client(
        HttpClientRequest.post(
          `/v1/messages`, {
          body: requestBody
        })
      ).json,
    ),
    Effect.andThen(({ result }) =>
      S.decodeUnknown(MessageResponse)(result)
    )
  )
