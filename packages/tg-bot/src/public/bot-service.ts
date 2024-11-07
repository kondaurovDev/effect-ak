import * as Effect from "effect/Effect";

import { TgBotHttpClient } from "../api/http-client.js";
import { TgChatService } from "../module/chat/service.js";
import { TgBotSettingsService } from "../module/settings/service.js";
import { TgPaymentService } from "../module/payment/service.js";
import { TgFileService } from "../module/file/service.js";

export class TgBotService
  extends Effect.Service<TgBotService>()("TgBotService", {
    effect:
      Effect.gen(function* () {

        const chat = yield* TgChatService;
        const botSettings = yield* TgBotSettingsService;
        const payment = yield* TgPaymentService;
        const file = yield* TgFileService;

        return {
          chat, botSettings, payment, file
        } as const;

      }),

    dependencies: [
      TgBotHttpClient.Default,
      TgChatService.Default,
      TgFileService.Default,
      TgBotSettingsService.Default,
      TgPaymentService.Default,
    ]

  }) { }
