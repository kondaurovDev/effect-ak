import { Config, Effect } from "effect";
import puppeteer from "puppeteer"
import { writeFile, readFile } from "fs/promises"

import { DocPage } from "../scrape/doc-page/_model";

export class PageProvider
  extends Effect.Service<PageProvider>()("PageProvider", {
    scoped:
      Effect.gen(function* () {

        const pagePath =
          yield* Config.nonEmptyString("page-path");

        yield* Effect.addFinalizer(() => Effect.logInfo("Closing scrapeDocPage"));

        const htmlString =
          yield* Effect.tryPromise(async () => {

            const saved = await readFile(pagePath).catch(() => undefined);

            if (saved) {
              return saved.toString("utf-8");
            }

            const browser = await puppeteer.launch()
            const page = await browser.newPage();

            await page.goto("https://core.telegram.org/bots/api");

            await page.waitForSelector(".dev_side_nav_wrap");

            const content = await page.content();

            await page.close();
            await browser.close();

            await writeFile(pagePath, content);

            return content;

          });

        const page = yield* DocPage.fromHtmlString(htmlString);

        return {
          page
        } as const;

      })
  }) { }
