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
          path: yield* Path
        };

        const generateImage =
          (request: GenerateImageRequest) =>
            Effect.gen(function* () {

              const formData = new FormData();
              formData.append("prompt", request.prompt);
              formData.append("output_format", "webp");

              const url = `/stable-image/generate${request.modelEndpoint}`;

              const response =
                yield* deps.client.execute(
                  HttpClientRequest.post(url, {
                    body: HttpBody.formData(formData),
                    headers: {
                      accept: "image/*"
                    }
                  })
                );

              const content = 
                new Uint8Array(yield* response.arrayBuffer);

              const name =
                `${response.headers["x-request-id"]}.webp`;

              return {
                content,
                name
              } as const;

            });

        const generateImageAndSave = 
          (request: GenerateImageRequest) => 
            Effect.gen(function* () {

              const image = yield* generateImage(request);

              const settings = yield* AiSettingsProvider;

              const filePath = deps.path.join(...settings.outDir, image.name);

              yield* deps.fs.writeFile(filePath, image.content);

              return filePath;
              
            });

        return {
          generateImage, generateImageAndSave
        } as const;
      }),

    dependencies: [
      StabilityaiHttpClient.Default
    ]
  }) { }
