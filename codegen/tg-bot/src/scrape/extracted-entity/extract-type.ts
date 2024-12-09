import { HtmlElement } from "#/types";
import { Either, Array } from "effect";

import { EntityField } from "../entity-field/_model";
import { NormalType } from "../normal-type/_model";
import { ExtractEntityError } from "./errors";
import { ExtractedEntityShape } from "./_model";
import { extractFieldDescription } from "./extract-description";
import { optional_field_label } from "./const";

export const extractType = (
  node: HtmlElement, entityName: string
): Either.Either<ExtractedEntityShape["type"], ExtractEntityError> => {
  if (node.tagName == "TABLE") {

    const fields: EntityField[] = [];

    const rows = node.querySelectorAll("tbody tr");

    for (const row of rows) {
      const all = row.querySelectorAll("td");

      const fieldName = all.at(0)?.text;
      if (!fieldName) return ExtractEntityError.left("NoColumn", { columnName: "name", entityName });
      const specType = all.at(1)?.text;
      if (!specType) return ExtractEntityError.left("NoColumn", { columnName: "type", entityName });
      const descriptionNode = all.at(all.length - 1); // description is the last column
      if (!descriptionNode) return ExtractEntityError.left("NoColumn", { columnName: "description", entityName });

      const description = extractFieldDescription(descriptionNode.text);

      let required = false;

      if (all.length == 3) {
        const isOptional = description[0].startsWith(optional_field_label);
        if (isOptional) description.shift();
        required = isOptional == false;
      } else {
        const isRequired = all.at(2)?.text;
        if (!isRequired) return ExtractEntityError.left("NoColumn", { columnName: "required", entityName });
        if (isRequired != optional_field_label && isRequired != "Yes") {
          return ExtractEntityError.left("UnexpectedValue", { columnName: "required", entityName })
        }
        required = isRequired != optional_field_label;
      };

      const normalType =
        NormalType.makeFrom({ entityName, fieldName, specType });

      if (Either.isLeft(normalType)) {
        console.warn(normalType.left)
        continue;
      }

      fields.push(
        new EntityField({
          name: fieldName, description, required,
          type: normalType.right
        })
      )
    };
    
    return Either.right({
      type: "fields",
      fields
    });

  }

  if (node.tagName == "UL") {

    const oneOf: string[] = [];

    const nodes = node.querySelectorAll("li");

    for (const node of nodes) {
      oneOf.push(node.text)
    }

    if (Array.isNonEmptyArray(oneOf)) {
      return Either.right({
        type: "normalType",
        normalType: new NormalType({ typeNames: oneOf })
      })
    }

    return ExtractEntityError.left("NoTypes");

  }

  return ExtractEntityError.left("NoTypes");

}
