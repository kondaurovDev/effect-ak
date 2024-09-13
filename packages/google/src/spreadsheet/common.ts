import { Context } from "effect";

export const urlPrefix = "/v4/spreadsheets";

export class SpreadsheetId 
  extends Context.Tag("@efkit/google.SpreadsheetId")<SpreadsheetId, string>() {}