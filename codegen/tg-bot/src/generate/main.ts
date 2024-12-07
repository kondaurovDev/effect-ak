import { Effect, Logger, LogLevel } from "effect";

import { generateNamespace } from "./namespace.js";
import { withConfig } from "#/layer.js";
import { PageProvider } from "#/service/page-provider.js";
import { WriteCodeService } from "#/service/write-code.js";

const run =
  Effect.gen(function* () {
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
