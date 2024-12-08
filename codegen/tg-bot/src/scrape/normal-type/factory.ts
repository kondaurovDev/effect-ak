import { Either, Array } from "effect";

import { type NormalTypeShape } from "./_model";
import { typeOverrides } from "./overrides";
import { mapType } from "./map-type";
import { NormalTypeError } from "./errors";

const array_of_label = "Array of";
const array_of_regex = /array of/ig

const makeArray = 
  (input: string) => {

    const dimension = [...input.matchAll(array_of_regex)].length;
    const typeName = input.replaceAll(array_of_regex, "").trim();

    return `${typeName}${"[]".repeat(dimension)}`;

  }

export const makeFrom =
  (input: {
    entityName: string,
    typeName: string
  }): Either.Either<NormalTypeShape, NormalTypeError> => {
    const override = typeOverrides[input.entityName]?.[input.typeName];

    if (override) Either.right(override);

    if (input.typeName.includes(" or ")) {
      const typeNames = input.typeName.split(" or ").map(mapType);

      if (Array.isNonEmptyArray(typeNames) && typeNames[0].length > 0) {
        return Either.right({ typeNames })
      }

      return NormalTypeError.left("EmptyType", input);

    } else if (input.typeName.startsWith(array_of_label)) {
      const typeName = mapType(makeArray(input.typeName));

      if (typeName.length > 0) {
        return Either.right({ typeNames: [ typeName ] });
      }

      return NormalTypeError.left("EmptyType", input);
    } else {
      const typeNames = Array.make(mapType(input.typeName));

      if (typeNames[0].length == 0) {
        return NormalTypeError.left("EmptyType", input);
      }

      return Either.right({ typeNames });
    }
  }
