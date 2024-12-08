import { Effect } from "effect";

import puppeteer from "puppeteer"
import { writeFile, readFile } from "fs/promises"

export const getPageHtml =
  (pagePath: string) =>
    Effect.tryPromise(async () => {

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