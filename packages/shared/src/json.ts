import { Effect, Brand, Data } from "effect";

export type ParsedJson = unknown & Brand.Brand<"ParsedJson">;
export const ParsedJson = Brand.nominal<ParsedJson>();

export type JsonString = string & Brand.Brand<"JsonString">;
export const JsonString = Brand.nominal<JsonString>();

const messages = {
  INVALID_JSON: `string doesn't have valid json syntax`,
  SERIALIZATION_ERROR: `can't transform an object to json string`,
  CREATE_JSON_SCHEMA_ERROR: `can't create json schema`,
}

export class JsonError extends Data.TaggedError("JsonError")<{
  error: keyof typeof messages
}> {
  get message() {
    return messages[this.error]
  }
}

export const parseJson = <T extends string>(
  json: T
) => 
  Effect.try({
    try: () => ParsedJson(JSON.parse(json)),
    catch: () => new JsonError({ error: "INVALID_JSON" })
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
  Effect.try({
    try: () => JsonString(JSON.stringify(input, replacer, 2) as string),
    catch: () => new JsonError({ error: "SERIALIZATION_ERROR" })
  })
