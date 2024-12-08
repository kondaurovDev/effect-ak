import { Match, pipe } from "effect";

export const mapType =
  (typeName: string) =>
    pipe(
      Match.value(typeName),
      Match.when("String", () => "string"),
      Match.when("Integer", () => "number"),
      Match.when("Float", () => "number"),
      Match.when("Boolean", () => "boolean"),
      Match.when("True", () => "true"),
      Match.orElse(() => typeName)
    );