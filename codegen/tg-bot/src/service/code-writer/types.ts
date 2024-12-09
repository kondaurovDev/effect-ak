import type { PropertySignatureStructure } from "ts-morph";
import type { TsSourceFile } from "#/types";
import type { ExtractedTypeShape } from "#/scrape/extracted-type/_model";

export const writeTypes =
  (src: TsSourceFile) =>
    (types: ExtractedTypeShape[]) => {
      for (const type of types) {

        if (type.type.type == "fields") {
          src.addInterface({
            name: type.typeName,
            isExported: true,
            ...(type.type.type == null ? undefined : {
              properties:
                type.type.fields.map(field => ({
                  name: field.name,
                  type: field.type.getTsType(),
                  hasQuestionToken: !field.required,
                  docs: [field.description.join("\n")]
                } as PropertySignatureStructure))
            })
          })
        } else {
          src.addTypeAlias({
            name: type.typeName,
            isExported: true,
            type: type.type.normalType.getTsType()
          })
        };
      }
    }
