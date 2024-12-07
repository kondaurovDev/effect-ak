import { ConfigProvider } from "effect"

// import * as ParseService from "#/scrape/service/_export";
// import * as GenerateService from "#/generate/service/_export";

export const withConfig =
  (input: {
    pagePath: string
  }) =>
    ConfigProvider.fromJson({
      "page-path": input.pagePath
    })

// export const makeMainLayer =
//    =>
//     Layer.mergeAll(
//       ParseService.DocPage.Default,
//       ParseService.MainExtractService.Default,
//       ParseService.TypeMapService.Default,
//       ParseService.MetaExtractService.Default,
//       GenerateService.WriteCodeService.Default,
//       GenerateService.GenerateNamespaceService.Default,
//       Logger.pretty
//     ).pipe(
//       Layer.provide(

//       )
//     )
