import { Config, Effect, pipe } from "effect";
import * as html_parser from "node-html-parser"
import puppeteer from "puppeteer"
import { writeFile, readFile } from "fs/promises"

export class ApiHtmlPage
  extends Effect.Service<ApiHtmlPage>()("ApiHtmlPage", {
    effect:
      Effect.gen(function* () {

        const pagePath = 
          yield* Config.nonEmptyString("page-path");

        const page = 
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

          })

        const pageContent =
          yield* pipe(
            Effect.tryPromise(() => readFile(pagePath)),
            Effect.andThen(_ => _.toString("utf-8")),
            Effect.andThen(html_parser.parse)
          );

        return {
          pageContent
        } as const;

      })
  }) { }