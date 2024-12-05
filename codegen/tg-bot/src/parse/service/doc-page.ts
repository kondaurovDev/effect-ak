import { Config, Effect, Either } from "effect";
import * as html_parser from "node-html-parser"
import puppeteer from "puppeteer"
import { writeFile, readFile } from "fs/promises"

export class DocPage
  extends Effect.Service<DocPage>()("DocPage", {
    effect:
      Effect.gen(function* () {

        const pagePath =
          yield* Config.nonEmptyString("page-path");

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

        const pageContent =
          yield* Either.try(() => html_parser.parse(htmlString));

        const getTypeOrMethodNode =
          (name: string) =>
            pageContent.querySelector(`a.anchor[name="${name.toLowerCase()}"]`)

        return {
          pageContent, getTypeOrMethodNode
        } as const;

      })
  }) {

  static findNextClosestSibling(
    input: {
      node: html_parser.HTMLElement,
      oneOftags: string[],
      maxSteps?: number
    }
  ) {

    const oneOfTags = new Set(input.oneOftags.map(_ => _.toUpperCase()));

    let resultNode = input.node.nextElementSibling;
    let run = true;
    let step = 1;
    const maxSteps = input.maxSteps ?? 10;

    return Either.gen(function* () {

      while (run) {
        if (step > maxSteps) return yield* Either.left(`Closest sibling is too far`);
        if (!resultNode) return yield* Either.left(`Cannot find closest sibling`);
        if (oneOfTags.has(resultNode?.tagName)) {
          return resultNode;
        }
        resultNode = resultNode?.nextElementSibling;
        step++;
      }

      return yield* Either.left("Closes sibling not found");

    });

  }


}