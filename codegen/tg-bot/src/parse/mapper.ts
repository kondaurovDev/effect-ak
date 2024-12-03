import { Effect, Either, Match, pipe } from "effect";

export class ParseMapperService
  extends Effect.Service<ParseMapperService>()("ParseMapperService", {
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
              return override.type;
            }

            if (input.typeName.includes(" or ")) {
              const types = input.typeName.split(" or ");

              return types.map(mapType).join(" | ")
            }

            if (input.typeName.startsWith(array_of_type)) {
              return `${mapType(input.typeName.slice(array_of_type.length))}[]`
            }

            return mapType(input.typeName);

          }

        const getNormalReturnType =
          (input: {
            methodName: string,
            methodDescription: string
          }) =>
            Either.gen(function* () {

              const sentence = yield* getSentenceOfReturnType(input);
  
              const isReturnedResult = [
                ...sentence.matchAll(is_returned_regex)
              ];

              if (isReturnedResult.length > 0) {
                return isReturnedResult.map(_ => mapType(_[0])).join(" | ")
              }

              const returnsResult = sentence.match(returns_regex);

              if (returnsResult) {
                return mapType(returnsResult[0]);
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
                _.startsWith(on_success) || 
                _.endsWith(is_returned) ||
                _.startsWith(returns)
            
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

const array_of_type = "Array of ";
const on_success = "On Success";
const is_returned = "is returned";
const returns = "Returns ";

const is_returned_regex = /\w+(?= is returned)/g
const returns_regex = /(?<=^Returns )\w+/g