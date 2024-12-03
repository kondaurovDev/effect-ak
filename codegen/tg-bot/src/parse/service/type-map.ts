import { Effect, Either, Match, pipe } from "effect";

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
          }) => {

            const override = typeOverrides[input.entityName];

            if (override) {
              return NormalType(override.type);
            }

            if (input.typeName.includes(" or ")) {
              const types = input.typeName.split(" or ");

              return NormalType(types.map(mapType).join(" | "))
            }

            if (input.typeName.startsWith(C.array_of_type)) {
              return NormalType(`${mapType(input.typeName.slice(C.array_of_type.length))}[]`)
            }

            return NormalType(mapType(input.typeName));

          }

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

              if (isReturnedResult.length > 0) {
                return NormalType(isReturnedResult.map(_ => mapType(_[0])).join(" | "))
              }

              const returnsResult = sentence.match(C.returns_regex);

              if (returnsResult) {
                return NormalType(mapType(returnsResult[0]));
              }
  
              return yield* Either.left("Cannot extract return type");
  
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
