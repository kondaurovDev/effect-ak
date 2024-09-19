import { Effect, Brand, pipe } from "effect";
import { UtilError } from "./util-error.js";

export type ParsedJson = unknown & Brand.Brand<"ParsedJson">;
export const ParsedJson = Brand.nominal<ParsedJson>();

export type JsonString = string & Brand.Brand<"JsonString">;
export const JsonString = Brand.nominal<JsonString>();

export const parseJson = <T extends string>(
  json: T
) => 
  Effect.try({
    try: () => ParsedJson(JSON.parse(json)),
    catch: () => new UtilError({ name: "json", details: "INVALID_JSON" })
  })

export function prepareReply(input: string): string {
  return input
    .replace(/ {2,}/g, " ")
    .replace(/\n +/g, "\n")
    .trim();
}

export type DataReplacer = (key: string, value: unknown) => unknown | undefined;

export const JsonReplacerOmitUnderscore: DataReplacer = (key, value) =>
  key.startsWith("_") ? undefined : value;

export const toJsonString = (
  input: unknown, replacer?: DataReplacer
) =>
  pipe(
    Effect.try(() => 
      JsonString(JSON.stringify(input, replacer, 2) as string)
    ),
    Effect.catchTag("UnknownException", exception =>
      new UtilError({ 
        name: "json",
        cause: exception, 
        details: {
          action: "SERIALIZATION_ERROR",
        }
      })
    )

  ) 

