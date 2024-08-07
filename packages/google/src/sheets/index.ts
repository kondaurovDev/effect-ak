import { Brand } from "effect";

export * from "./client"
export * from "./values"

export type SpreadsheetId = string & Brand.Brand<"SpreadsheetId">;
export const SpreadsheetId = Brand.nominal<SpreadsheetId>();

