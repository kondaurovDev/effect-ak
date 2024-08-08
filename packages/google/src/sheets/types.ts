import { Brand } from "effect";

export type SpreadsheetId = string & Brand.Brand<"SpreadsheetId">;
export const SpreadsheetId = Brand.nominal<SpreadsheetId>();
