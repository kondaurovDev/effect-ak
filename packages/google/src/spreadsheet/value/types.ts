import { Schema as S } from "@effect/schema";

export type Range = typeof Range.Type;
export const Range = S.NonEmptyString;

export const MajorDimension = S.Literal("ROWS", "COLUMNS");

// https://developers.google.com/sheets/api/guides/concepts#cell
export const CellValue = S.Union(S.String, S.Number, S.Boolean);

export type RowValues = typeof RowValues.Type
export const RowValues = S.NonEmptyArray(CellValue)
