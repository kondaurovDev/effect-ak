import { Effect } from "effect";

import { TgChatService } from "./chat/service.js";
import { TgBotHttpClient } from "../api/http-client.js";
import { TgBotSettingsService } from "./settings/service.js";
import { TgPaymentService } from "./payment/service.js";
import { TgFileService } from "./file/service.js";

export class TgBotService extends Effect.Service<TgBotService>()("TgBotService", {
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

}) {}