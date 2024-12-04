import { Effect, Either, pipe, Array } from "effect";
import type * as html_parser from "node-html-parser"

import { ApiHtmlPage } from "./api-html-page.js";
import { TypeMapService } from "./type-map.js";
import * as T from "../types.js";

export class MainExtractService
  extends Effect.Service<MainExtractService>()("MainExtractService", {
    effect:
      Effect.gen(function* () {

        const mapper = yield* TypeMapService;
        const { pageContent } = yield* ApiHtmlPage;

        const splitDescription = MainExtractService.descriptionSplitter();

        const getMethodMetadata =
          (input: {
            methodName: string
          }) =>
            Either.gen(function* () {

              const extracted =
                yield* getTypeOrMethod({
                  typeOrMethodName: input.methodName
                });

              if (extracted._tag == "ExtractedTypeOrMethodFields") {
                return new T.MethodMetadata({
                  methodName: extracted.typeOrMethodName,
                  returnType:
                    yield* mapper.getNormalReturnType({
                      methodDescription: extracted.typeOrMethodDescription,
                      methodName: extracted.typeOrMethodName
                    }),
                  description: extracted.typeOrMethodDescription,
                  fields: extracted.fields
                });
              }

              return yield* Either.left(`${input.methodName} does not contain any field`);

            });

        const getTypeMetadata =
          (input: {
            typeName: string
          }) =>
            Either.gen(function* () {

              const extracted =
                yield* getTypeOrMethod({
                  typeOrMethodName: input.typeName
                });

              if (extracted._tag == "ExtractedTypeOrMethodFields") {
                return new T.TypeMetadataFields({
                  typeName: extracted.typeOrMethodName,
                  description: extracted.typeOrMethodDescription,
                  fields: extracted.fields
                });
              }

              return new T.TypeMetadataOneOf({
                typeName: extracted.typeOrMethodName,
                description: extracted.typeOrMethodDescription,
                type: extracted.type
              });

            });

        const getNode =
          (input: {
            cssSelector: string,
            source?: html_parser.HTMLElement
          }) =>
            Either.fromNullable(
              (input.source ?? pageContent).querySelector(input.cssSelector),
              () => `Node '${input.cssSelector}' does not exist`
            );

        const getTypeOrMethod =
          (input: {
            typeOrMethodName: string
          }) =>
            Either.gen(function* () {
              const a_tag =
                yield* getNode({
                  cssSelector: `a.anchor[name="${input.typeOrMethodName.toLowerCase()}"]`
                });

              const typeOrMethodName =
                yield* Either.fromNullable(
                  a_tag.nextSibling?.text, () => "Title not found"
                );

              const typeOrMethodDescription =
                yield* pipe(
                  Either.fromNullable(
                    a_tag.parentNode.nextElementSibling?.text, () => "Description not found"
                  ),
                  Either.andThen(splitDescription)
                );

              const detailsNode =
                yield* Either.fromNullable(
                  a_tag.parentNode.nextElementSibling?.nextElementSibling, () => "Type/Method details not found"
                );

              if (detailsNode.tagName == "TABLE") {

                const fields: T.FieldTypeMetadata[] = [];

                const rows = detailsNode.querySelectorAll("tbody tr");

                for (const row of rows) {
                  const all = row.querySelectorAll("td");

                  const name = yield* Either.fromNullable(all.at(0)?.text, () => "Column 'name' not found");
                  const type = yield* Either.fromNullable(all.at(1)?.text, () => "Column 'type' not found");
                  const description =
                    yield* pipe(
                      Either.fromNullable(all.at(all.length - 1)?.text, () => "Column 'description' not found"), // description is the last column
                      Either.andThen(splitDescription)
                    )

                  const required =
                    yield* (
                      all.length == 3 ?
                        Either.right(description[0].startsWith("Optional") == false) :
                        pipe(
                          Either.fromNullable(all.at(2)?.text, () => "Column 'required' not found"),
                          Either.filterOrLeft(_ => _ == "Optional" || _ == "Yes", (input) => `'${input}' does not describe field requirement`),
                          Either.andThen(_ => _ != "Optional")
                        )
                    );

                  fields.push(
                    new T.FieldTypeMetadata({
                      name, description, required,
                      type:
                        yield* mapper.getNormalType({
                          entityName: typeOrMethodName,
                          typeName: type
                        })
                    })
                  )
                };

                return new T.ExtractedTypeOrMethodFields({
                  fields, typeOrMethodName, typeOrMethodDescription
                });

              }

              if (detailsNode.tagName == "UL") {

                const oneOf: string[] = [];

                const nodes = detailsNode.querySelectorAll("li");

                for (const node of nodes) {
                  oneOf.push(node.text)
                }

                if (Array.isNonEmptyArray(oneOf)) {
                  return new T.ExtractedTypeOrMethodOneOfType({
                    typeOrMethodName,
                    type: new T.NormalType({ typeNames: oneOf }),
                    typeOrMethodDescription
                  })
                }

                return yield* Either.left("At least one type is expected");

              }

              return yield* Either.left(`${input.typeOrMethodName}: Type definition not found`);

            });

        return {
          getTypeMetadata, getMethodMetadata
        }

      }),

    dependencies: [
      ApiHtmlPage.Default,
      TypeMapService.Default
    ]
  }) {

  static descriptionSplitter() {
    const description_split_regex = /(\.\s{1}|\.$)/g
    const contains_letters_regex = /\w{1,}/
    return (description: string) =>
      description
        .split(description_split_regex)
        .filter(s => contains_letters_regex.test(s));
  }

}
