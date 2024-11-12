import { HttpApiBuilder } from "@effect/platform";
import { Layer } from "effect";
import { Openai, Stabilityai } from "@effect-ak/ai/vendor";
import { AiSettingsProvider } from "@effect-ak/ai/internal";

import { UtilService } from "../util.js";
import { htmlRoute } from "./routes/html.js";
import { apiRoute } from "./routes/api.js";
import { staticRoute } from "./routes/static.js";
import { BackendApi } from "./http-api.js";

export const httpApiLive =
  HttpApiBuilder.api(BackendApi)
    .pipe(
      Layer.provide([
        htmlRoute,
        apiRoute,
        staticRoute
      ])
    ).pipe(
      Layer.provide([
        Openai.OpenaiChatCompletionEndpoint.Default,
        Stabilityai.ImageGenerationService.Default,
        UtilService.Default,
        AiSettingsProvider.Default
      ])
    )
