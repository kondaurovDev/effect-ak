import { Either, Array } from "effect";

import type { HtmlElement } from "#/types";
import type { ExtractedEntityShape } from "./_model";
import { NormalType } from "../normal-type/_model";
import { ExtractEntityError } from "./errors";
import { findTypeNode } from "./find-type";
import { extractEntityDescription } from "./extract-description";
import { extractType } from "./extract-type";

export const extractFromNode = (
  node: HtmlElement
): Either.Either<ExtractedEntityShape, ExtractEntityError> => {

  const entityName = node.lastChild?.text;

  if (!entityName) return ExtractEntityError.left("NoTitle");

  const entityDescription = extractEntityDescription(node, entityName);

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
  };

  const type = extractType(detailsNode.right, entityName);

  if (type._tag == "Left") return Either.left(type.left);

  return Either.right({
    entityName,
    entityDescription: entityDescription.right,
    type: type.right
  });

}
