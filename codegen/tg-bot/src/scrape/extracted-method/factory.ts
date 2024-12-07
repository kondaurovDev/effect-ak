import { Either } from "effect";

import type { ExtractedEntityShape } from "../extracted-entity/_model.js";
import type { ExtractedMethodShape } from "./_model.js";
import { ExtractMethodError } from "./errors.js";
import { NormalType } from "../normal-type/_model.js";

export const makeFrom = (
  entity: ExtractedEntityShape
): Either.Either<ExtractedMethodShape, ExtractMethodError> => {

  let parameters: ExtractedMethodShape["parameters"] | undefined;

  if (entity.type.type == "fields")
    parameters = entity.type.fields;

  const returnType = entity.entityDescription.returns;

  if (!returnType) 
    return Either.left(ExtractMethodError.make("ReturnTypeNotFound", entity));

  return Either.right({
    methodName: entity.entityName,
    methodDescription: entity.entityDescription.lines,
    returnType: new NormalType({ typeNames: returnType.typeNames }),
    parameters,
  });

}
