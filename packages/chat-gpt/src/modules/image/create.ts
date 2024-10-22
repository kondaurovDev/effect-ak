import { Effect } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";
import * as S from "effect/Schema";

import { ChatGptHttpClient } from "../../api/index.js";

const Response = 
  S.Struct({
    created: S.optional(S.Number),
    data: 
      S.Array(
        S.Struct({
          b64_json: S.String
        })
      )
  })

export const createImage = (
  prompt: string,
  model: "dall-e-2" | "dall-e-3",
) =>
  Effect.Do.pipe(
    Effect.tap(() =>
      Effect.fail("expensive")
    ),
    Effect.bind("httpClient", () => ChatGptHttpClient),
    Effect.bind("body", () =>
      HttpBody.json({
        model,
        prompt,
        response_format: "b64_json",
        style: "natural",
        quality: "hd",
        size: "1024x1024"
      })
    ),
    Effect.andThen(({ httpClient, body } ) =>
      httpClient.getTyped(
        HttpClientRequest.post(
          "/v1/images/generations", {
            body
          }
        ),
        Response
      ),
    ),
    Effect.andThen(_ =>
      Effect.fromNullable(_.data.at(0)?.b64_json)
    )
  )
