import { Effect, pipe } from "effect";
import * as html_parser from "node-html-parser"
import { readFile } from "fs/promises";
import * as Path from "path";

export class ApiHtmlPage
  extends Effect.Service<ApiHtmlPage>()("ApiHtmlPage", {
    effect:
      Effect.gen(function* () {

        const pagePath = Path.join(__dirname, "..", "..", "api.html");

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