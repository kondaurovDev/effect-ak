import * as Effect from "effect/Effect";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as S from "effect/Schema";

import { OpenaiHttpClient } from "../../api/index.js";

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
  Effect.gen(function* () {

    const body =
      yield* HttpBody.json({
        model,
        prompt,
        response_format: "b64_json",
        style: "natural",
        quality: "hd",
        size: "1024x1024"
      })

    const httpClient = yield* OpenaiHttpClient;

    const response =
      yield* httpClient.getTyped(
        HttpClientRequest.post(
          "/v1/images/generations", {
          body
        }),
        Response
      );

    return yield* Effect.fromNullable(response.data.at(0)?.b64_json)

  })

