import { Effect, Either } from "effect";
import * as html_parser from "node-html-parser"
import { ApiHtmlPage } from "./api-html-page";

const locators = {
  sidebarDiv: "div.dev_side_nav"
}

export class ExtractService
  extends Effect.Service<ExtractService>()("ExtractService", {
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

        const getSidebarSectionNames =
          Either.gen(function* () {

            const sections = pageContent.querySelectorAll(`${locators.sidebarDiv} > ul`);

            if (sections.length == 0) {
              yield* Either.left("Cannot find dev sections")
            }

            const result = sections.map(_ => _.text);

            return result;

          });

        const getTypeOrMethod =
          (typeOrMethodName: string) =>
            Either.gen(function* () {
              const a_tag =
                yield* getNode({
                  cssSelector: `a.anchor[name="${typeOrMethodName.toLowerCase()}"]`
                });

              const name =
                yield* Either.fromNullable(
                  a_tag.nextSibling?.text, () => "Title not found"
                );

              const description =
                yield* Either.fromNullable(
                  a_tag.parentNode.nextElementSibling?.text, () => "Description not found"
                );

              const table =
                yield* Either.fromNullable(
                  a_tag.parentNode.nextElementSibling?.nextElementSibling, () => "Table with fields not found"
                );

              if (table.tagName != "TABLE") {
                yield* Either.left(`Table node was expected, found ${table.tagName}`)
              }

              return {
                name, description, table
              } as const;

            });

        const getMethodDescription =
          (input: {
            methodName: string
          }) =>
            Either.gen(function* () {

              const {
                description, table, name
              } = yield* getTypeOrMethod(input.methodName);

              const head = table.querySelectorAll("thead tr th");

              if (head.length != 4) {
                yield* Either.left(`A table with 4 columns was expected, actual ${head.length}`)
              }

              const parameters = [] as {
                name: string,
                required: boolean,
                type: string,
                description: string
              }[];

              const rows = table.querySelectorAll("tbody tr");

              for (const row of rows) {
                const first = row.querySelectorAll("td");

                const content =
                  yield* Either.all({
                    name: Either.fromNullable(first.at(0)?.text, () => "Parameter field 'name' not found"),
                    type: Either.fromNullable(first.at(1)?.text, () => "Parameter field 'type' not found"),
                    required: Either.fromNullable(first.at(2)?.text, () => "Parameter field 'required' not found"),
                    description: Either.fromNullable(first.at(3)?.text, () => "Field field 'description' not found")
                  })

                  parameters.push({
                    ...content,
                    required: content.required == "Yes" ? true : false
                  })
              }

              return {
                name, description, parameters
              } as const;

            });


        const getTypeDescription =
          (input: {
            typeName: string
          }) =>
            Either.gen(function* () {

              const {
                description, table, name
              } = yield* getTypeOrMethod(input.typeName);

              const head = table.querySelectorAll("thead tr th");

              if (head.length != 3) {
                yield* Either.left(`A table with 3 columns was expected, actual ${head.length}`)
              }

              const fields = [] as {
                name: string,
                type: string,
                description: string
              }[];

              const rows = table.querySelectorAll("tbody tr");

              for (const row of rows) {
                const first = row.querySelectorAll("td");

                const content =
                  yield* Either.all({
                    name: Either.fromNullable(first.at(0)?.text, () => "Field name not found"),
                    type: Either.fromNullable(first.at(1)?.text, () => "Field type not found"),
                    description: Either.fromNullable(first.at(2)?.text, () => "Field description not found")
                  })

                fields.push(content)
              }

              return {
                name, description, fields
              } as const;

            });

        return {
          getTypeDescription, getMethodDescription
        }

      }),

    dependencies: [
      ApiHtmlPage.Default
    ]
  }) { }