import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as S from "effect/Schema";

import { StabilityaiHttpClient } from "../api/http-client.js";
import { GeneratedEncodedImageResponse, GenerateImageRequest } from "./schema.js";

export class ImageGenerationService
  extends Effect.Service<ImageGenerationService>()("ImageGenerationService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* StabilityaiHttpClient;

        const generateImage = (
          request: GenerateImageRequest
        ) =>
          Effect.gen(function* () {

            const formData = new FormData();
            formData.append("prompt", request.prompt);
            formData.append("output_format", "webp");

            const url = `/stable-image/generate${request.modelEndpoint}`;

            const result =
              yield* pipe(
                httpClient.getJson(
                  HttpClientRequest.post(url, {
                    body: HttpBody.formData(formData),
                    headers: {
                      accept: "application/json"
                    }
                  })
                ),
                Effect.andThen(S.decodeUnknown(GeneratedEncodedImageResponse))
              );

            return result;

          })


        return {
          generateImage
        } as const;
      }),

    dependencies: [
      StabilityaiHttpClient.Default
    ]
  }) { }
