import { Effect, Either } from "effect";
import type * as html_parser from "node-html-parser"

import { ApiHtmlPage } from "./api-html-page.js";
import { method_type_name_regex } from "../const.js";

export class NavbarExtractService
  extends Effect.Service<NavbarExtractService>()("NavbarExtractService", {
    effect:
      Effect.gen(function* () {

        const { pageContent } = yield* ApiHtmlPage;

        const getNode =
          (input: {
            cssSelector: string,
            source?: html_parser.HTMLElement
          }) =>
            Either.fromNullable(
              (input.source ?? pageContent).querySelector(input.cssSelector),
              () => `Node '${input.cssSelector}' does not exist`
            );

        const getAllTypeNames =
          Either.gen(function* () {

            const allHeaders = pageContent.querySelectorAll("h4 > a");

            if (!allHeaders) {
              return yield* Either.left("Types not found");
            }

            const result = {
              methodNames: [] as string[],
              typeNames: [] as string[]
            }

            for (const node of allHeaders) {

              const sectionName = node.closest("h3 > a");

              if (!sectionName) {
                return yield* Either.left("Unknown section");
              }

              const title = node.nextSibling?.text;

              if (!title || !method_type_name_regex.test(title)) continue;

              if (title[0] == title[0].toUpperCase()) {
                result.typeNames.push(title);
                continue;
              }

              result.methodNames.push(title);

            }

            return result;

          });

        return {
          getAllTypeNames
        } as const;

      }),

      dependencies: [
        ApiHtmlPage.Default
      ]

  }) { }
