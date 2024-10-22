import { Context } from "effect";
import * as S from "effect/Schema";

export type SpreadsheetId = typeof SpreadsheetId.Type;
export const SpreadsheetId = S.NonEmptyString.pipe(S.brand("Google.SpreadsheetId"))

export class SpreadsheetIdProvider
  extends Context.Tag("@efkit/google.SpreadsheetIdProvider")<SpreadsheetIdProvider, SpreadsheetId>() {}

export type Range = typeof Range.Type;
export const Range = S.NonEmptyString;

export type MajorDimension = typeof MajorDimension.Type;
export const MajorDimension = S.Literal("ROWS", "COLUMNS");

// https://developers.google.com/sheets/api/guides/concepts#cell
export type CellValue = typeof CellValue.Type;
export const CellValue = S.Union(S.String, S.Number, S.Boolean);

export type RowValues = typeof RowValues.Type
export const RowValues = S.NonEmptyArray(CellValue)

export type ValueRangeType = typeof ValueRange.Type
export class ValueRange 
  extends S.Class<ValueRange>("ValueRange")({
    range: Range,
    values: RowValues.pipe(S.NonEmptyArray),
    majorDimension: MajorDimension,
  }) {}

export type AppendValuesToSheetCommandInput = typeof AppendValuesToSheetCommand.Type
export class AppendValuesToSheetCommand 
  extends S.Class<AppendValuesToSheetCommand>("AppendValuesToSheetCommand")({
    valueRange: ValueRange,
    spreadsheetId: SpreadsheetId
  }) {}
