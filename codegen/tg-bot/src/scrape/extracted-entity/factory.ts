import { Either, Array } from "effect";

import type { HtmlElement } from "#/types";
import type { ExtractedEntityShape } from "./_model";
import { EntityField } from "../entity-field/_model";
import { NormalType } from "../normal-type/_model";
import { ExtractEntityError } from "./errors";
import { findTypeNode } from "./find-type";
import { extractDescription } from "./extract-description";

export const extractFromNode = (
  node: HtmlElement
): Either.Either<ExtractedEntityShape, ExtractEntityError> => {

  const entityName = node.lastChild?.text;

  if (!entityName) return ExtractEntityError.left("NoTitle");

  const entityDescription = extractDescription(node, entityName);

  if (entityDescription._tag == "Left") return Either.left(entityDescription.left);

  const detailsNode = findTypeNode(node);

  if (Either.isLeft(detailsNode)) {
    if (detailsNode.left.error == "TypeDefinition:StopTagEncountered") {
      return Either.right({
        entityName,
        entityDescription: entityDescription.right,
        type: {
          type: "normalType",
          normalType: new NormalType({ typeNames: [ "never" ]})
        }
      })
    };
    return Either.left({
      ...detailsNode.left,
      details: {
        entityName: entityName
      }
    });
  }

  if (detailsNode.right.tagName == "TABLE") {

    const fields: EntityField[] = [];

    const rows = detailsNode.right.querySelectorAll("tbody tr");

    for (const row of rows) {
      const all = row.querySelectorAll("td");

      const name = all.at(0)?.text;
      if (!name) return ExtractEntityError.left("NoColumn", { columnName: "name", entityName });
      const typeName = all.at(1)?.text;
      if (!typeName) return ExtractEntityError.left("NoColumn", { columnName: "type", entityName });
      const description = all.at(all.length - 1); // description is the last column
      if (!description) return ExtractEntityError.left("NoColumn", { columnName: "description", entityName });

      let required = false;

      if (all.length == 3) {
        required = description.text.startsWith("Optional") == false
      } else {
        const isRequired = all.at(2)?.text;
        if (!isRequired) return ExtractEntityError.left("NoColumn", { columnName: "required", entityName });
        if (isRequired != "Optional" && isRequired != "Yes") {
          return ExtractEntityError.left("UnexpectedValue", { columnName: "required", entityName })
        }
        required = isRequired != "Optional";
      };

      const normalType =
        NormalType.makeFrom({ entityName, typeName });

      if (Either.isLeft(normalType)) {
        console.warn(normalType.left)
        continue;
      }

      fields.push(
        new EntityField({
          name, description: [], required,
          type: normalType.right
        })
      )
    };
    
    return Either.right({
      entityName,
      entityDescription: entityDescription.right,
      type: {
        type: "fields",
        fields
      },
    });

  }

  if (detailsNode.right.tagName == "UL") {

    const oneOf: string[] = [];

    const nodes = detailsNode.right.querySelectorAll("li");

    for (const node of nodes) {
      oneOf.push(node.text)
    }

    if (Array.isNonEmptyArray(oneOf)) {
      return Either.right({
        entityName,
        entityDescription: entityDescription.right,
        type: {
          type: "normalType",
          normalType: new NormalType({ typeNames: oneOf })
        },
      })
    }

    return ExtractEntityError.left("NoTypes");

  }

  return ExtractEntityError.left("TypeDefinition:NotFound");
}
