import { Effect, Either, Match, pipe, Array } from "effect";

import * as C from "../const.js";
import { NormalType } from "../types.js";

export class ParseTypeMapService
  extends Effect.Service<ParseTypeMapService>()("ParseTypeMapService", {
    effect:
      Effect.gen(function* () {

        const typeOverrides: Record<string, Record<string, string>> = {
          Chat: {
            type: `"private" | "group" | "supergroup" | "channel"`
          }
        };

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
            typeName: string,
            description: string
          }) =>
            Either.gen(function* () {

              const override = typeOverrides[input.entityName];
  
              if (override) {
                return new NormalType({ typeNames: [ override.type ] });
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
                  return new NormalType({ typeNames: [ `${typeName}[]` ] })
                }

                return yield* mustBeNonEmpty;
              } else {
                const typeNames = Array.make(mapType(input.typeName));

                if (typeNames[0].length == 0) {
                  return yield* mustBeNonEmpty;
                }
                
                return new NormalType({ typeNames });
              }
  
            })

        const getNormalReturnType =
          (input: {
            methodName: string,
            methodDescription: string
          }) =>
            Either.gen(function* () {

              const sentence = yield* getSentenceOfReturnType(input);
  
              const isReturnedResult = [
                ...sentence.matchAll(C.is_returned_regex)
              ];

              if (Array.isNonEmptyArray(isReturnedResult)) {
                const typeNames = Array.map(isReturnedResult, _ => mapType(_[0]));
                return new NormalType({ typeNames });
              }

              const returnsResult = sentence.match(C.returns_regex);

              if (returnsResult) {
                return new NormalType({ typeNames: [ mapType(returnsResult[0]) ]});
              }
  
              return yield* Either.left("Cannot extract return type from description");
  
            })

        const getSentenceOfReturnType =
          (input: {
            methodDescription: string
          }) => {
            const parts = input.methodDescription.split(".").map(_ => _.trim());

            const hasReturnType = 
              (_: string) =>
                _.startsWith(C.on_success) || 
                _.endsWith(C.is_returned) ||
                _.startsWith(C.returns)
            
            return Either.fromNullable(
              parts.find(hasReturnType),
              () => "Sentence with return type not found"
            );

          }

        return {
          getNormalType, getNormalReturnType, getSentenceOfReturnType
        } as const;

      })
  }) { }
