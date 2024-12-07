import { Context, Effect, Logger, LogLevel } from "effect";
import { test } from "vitest";

import { PageProvider } from "#/service/page-provider";
import { withConfig } from "#/layer";
import { DocPage } from "#/scrape/doc-page/_model";

type PageFixture = {
  readonly page: DocPage
};

const makeFixture =
  Effect.gen(function* () {

    console.log("create node fixture =>");

    const { page } = yield* PageProvider;

    return { page } as const;
  }).pipe(
    Effect.provide(PageProvider.Default),
    Effect.withConfigProvider(
      withConfig({
        pagePath: "tg-bot-api.html"
      })
    ),
    Logger.withMinimumLogLevel(LogLevel.Debug)
  );

const fixture = makeFixture.pipe(Effect.runPromise);

export const pageTest = test.extend<PageFixture>(({
  page: async ({}, use) => {
    const page  = await fixture;
    use(page.page);
  }
}))
