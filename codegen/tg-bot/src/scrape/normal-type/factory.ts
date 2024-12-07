import { Either, Array } from "effect";

import { type NormalTypeShape } from "./_model";
import { typeOverrides } from "./overrides";
import { mapType } from "./map-type";

export const makeFrom =
  (input: {
    entityName: string,
    typeName: string
  }): Either.Either<NormalTypeShape, string> => {
    const override = typeOverrides[input.entityName];

    if (override) {
      return Either.right({ typeNames: [ override.type ] });
    }

    const mustBeNonEmpty =
      Either.left(`'${input.typeName} must be non empty string'`);

    if (input.typeName.includes(" or ")) {
      const typeNames = input.typeName.split(" or ").map(mapType);

      if (Array.isNonEmptyArray(typeNames) && typeNames[0].length > 0) {
        return Either.right({ typeNames })
      }

      return mustBeNonEmpty;

    } else if (input.typeName.startsWith("Array of ")) {
      const typeName = mapType(input.typeName.slice("Array of ".length));

      if (typeName.length > 0) {
        return Either.right({ typeNames: [`${typeName}[]`] })
      }

      return mustBeNonEmpty;
    } else {
      const typeNames = Array.make(mapType(input.typeName));

      if (typeNames[0].length == 0) {
        return mustBeNonEmpty;
      }

      return Either.right({ typeNames });
    }
  }
