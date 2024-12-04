import { ConfigProvider, Layer, Logger } from "effect"

import * as ParseService from "#/parse/service/_export";
import * as GenerateService from "#/generate/service/_export";

export const makeMainLayer =
  (input: {
    pagePath: string
  }) =>
    Layer.mergeAll(
      ParseService.MainExtractService.Default,
      ParseService.TypeMapService.Default,
      ParseService.MetaExtractService.Default,
      GenerateService.WriteCodeService.Default,
      GenerateService.GenerateNamespaceService.Default,
      Logger.pretty
    ).pipe(
      Layer.provide(
        Layer.setConfigProvider(
          ConfigProvider.fromJson({
            "page-path": input.pagePath
          })
        )
      )
    )
