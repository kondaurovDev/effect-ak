import * as Effect from "effect/Effect";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import { FileSystem } from "@effect/platform/FileSystem";
import { Path } from "@effect/platform/Path";

import { StabilityaiHttpClient } from "../api/http-client.js";
import { GenerateImageRequest } from "./schema.js";
import { AiSettingsProvider } from "../../../internal/settings.js";

export class ImageGenerationService
  extends Effect.Service<ImageGenerationService>()("ImageGenerationService", {
    effect:
      Effect.gen(function* () {

        const deps = {
          client: yield* StabilityaiHttpClient,
          fs: yield* FileSystem,
          path: yield* Path,
          settings: yield* AiSettingsProvider
        };

        const generateImage =
          (request: GenerateImageRequest) =>
            Effect.gen(function* () {

              const formData = new FormData();
              formData.append("prompt", request.prompt);
              formData.append("output_format", "webp");

              const url = `/stable-image/generate${request.modelEndpoint}`;

              const response =
                yield* deps.client.getTypedArray(
                  HttpClientRequest.post(url, {
                    body: HttpBody.formData(formData),
                    headers: {
                      accept: "image/*"
                    }
                  })
                )

              const name =
                `${response.headers["x-request-id"]}.webp`;

              return {
                content: response.bytes,
                name
              } as const;

            });

        const generateImageAndSave = 
          (request: GenerateImageRequest) => 
            Effect.gen(function* () {

              const image = yield* generateImage(request);

              yield* Effect.logInfo("New image was generated");

              const filePath = deps.path.resolve(deps.settings.outDir, image.name);

              yield* deps.fs.writeFile(filePath, image.content);

              yield* Effect.logInfo("Image has been saved");

              return deps.path.parse(filePath);
              
            });

        return {
          generateImage, generateImageAndSave
        } as const;
      }),

    dependencies: [
      StabilityaiHttpClient.Default,
      AiSettingsProvider.Default
    ]
  }) { }
