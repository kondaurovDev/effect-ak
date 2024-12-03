import { ConfigProvider, Layer, Logger } from "effect"

import { MainExtractService, ParseTypeMapService } from "#/parse/service/_export";

export const testEnv = 
  Layer.mergeAll(
    MainExtractService.Default,
    ParseTypeMapService.Default,
    Logger.pretty
  ).pipe(
    Layer.provide(
      Layer.setConfigProvider(
        ConfigProvider.fromJson({
          "page-path": "tg-bot-api.html"
        })
      )
    )
  );
