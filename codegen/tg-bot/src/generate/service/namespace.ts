import { Effect, Either, String } from "effect";
import * as TsMorph from "ts-morph"

import { WriteCodeService } from "./write-code.js";
import { Namespace } from "#/parse/types.js";
import { MetaExtractService } from "#/parse/service/meta-extract.js";

export class GenerateNamespaceService
  extends Effect.Service<GenerateNamespaceService>()("GenerateNamespaceService", {
    effect:
      Effect.gen(function* () {

        const writeCode = yield* WriteCodeService;
        const extract = yield* MetaExtractService;

        const makeMethodInterfaceInputName =
          (_: string) => `${String.snakeToPascal(_)}Input`;

        const makeApiInterfaceName = 
          (_: string) => `${String.snakeToPascal(_)}Api`;

        const generate =
          (input: {
            namespace: Namespace
          }) =>
            Either.gen(function* () {

              const ns = extract.getNamespaceMetadata(input);

              const src =
                yield* writeCode.createTsFile({
                  fileName: input.namespace
                });

              const apiInterfaceName =
                makeApiInterfaceName(input.namespace)

              src.addInterface({
                name: apiInterfaceName,
                methods:
                  ns.methods.slice(0, 10).map(method => ({
                    name: method.methodName,
                    returnType: method.returnType.tsType,
                    docs: [ method.description.join("\n") ],
                    parameters: [
                      {
                        name: "_",
                        type: makeMethodInterfaceInputName(method.methodName)
                      }
                    ]
                  } as TsMorph.MethodSignatureStructure))
              });

              for (const method of ns.methods.slice(0, 10)) {

                const interfaceName = makeMethodInterfaceInputName(method.methodName)

                src.addInterface({
                  name: interfaceName,
                  properties:
                    method.fields.map(field => ({
                      name: field.name,
                      type: field.type.tsType,
                      hasQuestionToken: !field.required,
                      docs: [ field.description.join("\n") ]
                    } as TsMorph.PropertySignatureStructure))
                });

              }

            })

        return {
          generate
        }

      }),

    dependencies: [
      WriteCodeService.Default,
      MetaExtractService.Default
    ]

  }) { }