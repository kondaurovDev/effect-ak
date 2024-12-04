import { Effect, Either, Match, pipe, Array } from "effect";

import * as C from "../const.js";
import { NormalType } from "../types.js";

export class TypeMapService
  extends Effect.Service<TypeMapService>()("TypeMapService", {
    effect:
      Effect.gen(function* () {

        const typeOverrides: Record<string, Record<string, string>> = {
          Chat: {
            type: `"private" | "group" | "supergroup" | "channel"`
          }
        };

        const returnTypeOverrides: Record<string, string> = {
          copyMessage: "MessageId",
          getUserProfilePhotos: "UserProfilePhotos",
          getFile: "File"
        }

        const mapType =
          (typeName: string) =>
            pipe(
              Match.value(typeName),
              Match.when("String", () => "string"),
              Match.when("Integer", () => "number"),
              Match.when("Boolean", () => "boolean"),
              Match.when("True", () => "true"),
              Match.orElse(() => typeName)
            );

        const getNormalType =
          (input: {
            entityName: string,
            typeName: string
          }) =>
            Either.gen(function* () {

              const override = typeOverrides[input.entityName];

              if (override) {
                return new NormalType({ typeNames: [override.type] });
              }

              const mustBeNonEmpty =
                Either.left(`'${input.typeName} must be non empty string'`);

              if (input.typeName.includes(" or ")) {
                const typeNames = input.typeName.split(" or ").map(mapType);

                if (Array.isNonEmptyArray(typeNames) && typeNames[0].length > 0) {
                  return new NormalType({ typeNames })
                }

                return yield* mustBeNonEmpty;

              } else if (input.typeName.startsWith(C.array_of_type)) {
                const typeName = mapType(input.typeName.slice(C.array_of_type.length));

                if (typeName.length > 0) {
                  return new NormalType({ typeNames: [`${typeName}[]`] })
                }

                return yield* mustBeNonEmpty;
              } else {
                const typeNames = Array.make(mapType(input.typeName));

                if (typeNames[0].length == 0) {
                  return yield* mustBeNonEmpty;
                }

                return new NormalType({ typeNames });
              }

            });

        const getSentenceOfReturnType = 
          TypeMapService.getSentenceOfReturnType();

        const getNormalReturnType =
          (input: {
            methodName: string,
            methodDescription: string[]
          }) =>
            Either.gen(function* () {

              const override = 
                returnTypeOverrides[input.methodName];

              if (override) return new NormalType({ typeNames: [ override ]});

              const sentence = yield* pipe(
                getSentenceOfReturnType(input),
                Either.mapLeft(_ => `${input.methodName}: ${_}`)
              );

              const isReturnedResult = [
                ...sentence.matchAll(C.is_returned_regex)
              ];

              if (Array.isNonEmptyArray(isReturnedResult)) {
                const typeNames = Array.map(isReturnedResult, _ => mapType(_[0]));
                return new NormalType({ typeNames });
              }

              const returnsResult = sentence.match(C.returns_regex);

              if (returnsResult) {
                return new NormalType({ typeNames: [mapType(returnsResult[0])] });
              }

              return yield* Either.left("Cannot extract return type from description");

            })

        return {
          getNormalType, getNormalReturnType
        } as const;

      })
  }) {

  static getSentenceOfReturnType() {

    const on_success = "On Success";
    const is_returned = "is returned";
    const returns = "Returns ";

    return (input: {
      methodDescription: string[]
    }) => {

      const hasReturnType =
        (_: string) =>
          _.startsWith(on_success) ||
          _.endsWith(is_returned) ||
          _.startsWith(returns)

      return Either.fromNullable(
        input.methodDescription.find(hasReturnType),
        () => "Sentence with return type not found"
      );

    }
  }


}
