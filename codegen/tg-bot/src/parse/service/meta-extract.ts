import { Effect } from "effect";

import { DocPage } from "./doc-page.js";
import { method_type_name_regex, namespacesMap } from "../const.js";
import { NamespaceMetadata, type Namespace } from "../types.js";
import { MainExtractService } from "./main-extract.js";

export class MetaExtractService
  extends Effect.Service<MetaExtractService>()("MetaExtractService", {
    effect:
      Effect.gen(function* () {

        const { pageContent } = yield* DocPage;
        const extract = yield* MainExtractService;

        const getNamespaceMetadata =
          (input: {
            namespace: Namespace
          }) => {
            const result =
              new NamespaceMetadata({
                methods: [], types: []
              });

            for (const selector of namespacesMap[input.namespace].selectors) {

              const nodes = pageContent.querySelectorAll(selector);

              for (const node of nodes) {

                const title = node.nextSibling?.text;

                if (!title || !method_type_name_regex.test(title)) continue;

                if (title[0] == title[0].toUpperCase()) {

                  const type = 
                    extract.getTypeMetadata({
                      typeName: title,
                    });

                  if (type._tag == "Left") {
                    console.warn(type.left);
                    continue;
                  }

                  result.types.push(type.right);
                  continue;
                }

                const method = 
                  extract.getMethodMetadata({
                    methodName: title,
                  });

                if (method._tag == "Left") {
                  console.warn(method.left);
                  continue;
                }

                result.methods.push(method.right);

              }

            }

            return result;
          }

        return {
          getNamespaceMetadata
        } as const;

      }),

    dependencies: [
      DocPage.Default,
      MainExtractService.Default
    ]

  }) { }
