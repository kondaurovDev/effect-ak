import { Effect } from "effect";

import { DeepgramHttpClient } from "../../api/http-client.js";
import { HttpClientRequest } from "@effect/platform";

export class SpeachToTextService
  extends Effect.Service<SpeachToTextService>()("SpeachToTextService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* DeepgramHttpClient;

        const getTranscription = (
          file: File
        ) =>
          httpClient.getJson(
            HttpClientRequest.post("/listen", 
              {
                body: HttpClientRequest.bodyFile()
              }
            ),

          )


      })
  }) { }