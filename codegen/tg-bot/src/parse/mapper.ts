import { Effect, Match, pipe } from "effect";

const array_of_type = "Array of ";

export class ParseMapperService
  extends Effect.Service<ParseMapperService>()("ParseMapperService", {
    effect:
      Effect.gen(function* () {

        const typeOverrides: Record<string, Record<string, string>> = {
          Chat: {
            type: `"private" | "group" | "supergroup" | "channel"`
          }
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
            )

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
            description: string
          }) => {

            if (input.description.includes("if the edited message is not an inline")) {
              return "Message | true"
            }

            return "";

          }

        const getSentenceOfReturnType =
          (input: {
            methodDescription: string
          }) =>
            ""

        return {
          getNormalType, getNormalReturnType, getSentenceOfReturnType
        } as const;

      })
  }) { }
