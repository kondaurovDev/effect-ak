import { Effect, String } from "effect";

import * as TsMorph from "ts-morph"
import { PageProvider } from "#/service/page-provider";
import { WriteCodeService } from "#/service/write-code";
import { EntityNamespaceName } from "#/scrape/entity-namespace/const";
import { EntityNamespace } from "#/scrape/entity-namespace/_model";

const limit = 10;

export const generateNamespace =
  (namespaceName: EntityNamespaceName) =>
    Effect.gen(function* () {

      const { page } = yield* PageProvider;
      const writeCode = yield* WriteCodeService;

      const makeMethodInterfaceInputName =
        (_: string) => `${String.snakeToPascal(_)}Input`;

      const makeApiInterfaceName =
        (_: string) => `${String.snakeToPascal(_)}Api`;

      const ns =
        yield* EntityNamespace.makeFromPage(page, namespaceName);

      const src =
        yield* writeCode.createTsFile({
          fileName: namespaceName
        });

      const apiInterfaceName =
        makeApiInterfaceName(namespaceName);

      src.addInterface({
        name: apiInterfaceName,
        methods:
          ns.methods.slice(0, limit).map(method => ({
            name: method.methodName,
            returnType: method.returnType.tsType,
            docs: [method.methodDescription.join("\n")],
            parameters: [
              {
                name: "_",
                type: makeMethodInterfaceInputName(method.methodName)
              }
            ]
          } as TsMorph.MethodSignatureStructure))
      });

      // for (const method of ns.methods) {

      //   const interfaceName = makeMethodInterfaceInputName(method.methodName)

      //   src.addInterface({
      //     name: interfaceName,
      //     ...(method.parameters == null ? undefined : {
      //       properties:
      //         method.parameters.map(field => ({
      //           name: field.name,
      //           type: field.type.tsType,
      //           hasQuestionToken: !field.required,
      //           docs: [field.description.join("\n")]
      //         } as TsMorph.PropertySignatureStructure))
      //     })

      //   });

      // }

      for (const type of ns.types) {

        if (type.type.type == "fields") {
          src.addInterface({
            name: type.typeName,
            ...(type.type.type == null ? undefined : {
              properties:
                type.type.fields.map(field => ({
                  name: field.name,
                  type: field.type.tsType,
                  hasQuestionToken: !field.required,
                  docs: [field.description.join("\n")]
                } as TsMorph.PropertySignatureStructure))
            })
          })
        } else {
          src.addTypeAlias({
            name: type.typeName,
            type: type.type.normalType.tsType
          })
        };

      }

    });
