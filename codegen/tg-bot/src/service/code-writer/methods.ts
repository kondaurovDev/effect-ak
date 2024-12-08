import { String } from "effect";

import type { TsSourceFile } from "#/types";
import type { MethodSignatureStructure, PropertySignatureStructure } from "ts-morph";
import type { ExtractedMethodShape } from "#/scrape/extracted-method/_model";

export const writeMethods =
  (src: TsSourceFile) =>
    (methods: ExtractedMethodShape[]) => {
      const makeMethodInterfaceInputName =
        (_: string) => `${String.snakeToPascal(_)}Input`;

      src.addInterface({
        name: "TgBotApi",
        methods:
          methods.map(method => ({
            name: method.methodName,
            returnType: method.returnType.tsType,
            docs: [method.methodDescription.join("\n")],
            parameters: [
              {
                name: "_",
                type: makeMethodInterfaceInputName(method.methodName)
              }
            ]
          } as MethodSignatureStructure))
      });

      for (const method of methods) {

        const interfaceName = makeMethodInterfaceInputName(method.methodName)

        src.addInterface({
          name: interfaceName,
          ...(method.parameters == null ? undefined : {
            properties:
              method.parameters.map(field => ({
                name: field.name,
                type: field.type.tsType,
                hasQuestionToken: !field.required,
                docs: [field.description.join("\n")]
              } as PropertySignatureStructure))
          })

        });

      }
    }