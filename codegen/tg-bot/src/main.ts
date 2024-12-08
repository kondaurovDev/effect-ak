import { Effect, Logger, LogLevel } from "effect";

import { withConfig } from "./config.js";
import { PageProviderService } from "./service/index.js";
import { namespacesMap } from "./scrape/extracted-entities/const.js";

const run =
  Effect.gen(function* () {

    const { page } = yield* PageProviderService;

    for (const namespaceName of Objec) {

    }

    yield* generateNamespace("primary");
  }).pipe(
    Effect.provide([
      PageProvider.Default,
      WriteCodeService.Default
    ]),
    Effect.withConfigProvider(
      withConfig({
        pagePath: "tg-bot-api.html"
      })
    ),
    Logger.withMinimumLogLevel(LogLevel.Debug),
    Effect.runPromise
  );

run.then(() => console.log("done generating"))
