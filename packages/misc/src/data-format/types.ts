import * as S from "effect/Schema"

export type UnknownDecoded = typeof UnknownDecoded.Type;
export const UnknownDecoded = S.Unknown.pipe(S.brand("UnknownDecoded"));

export type JsonString = typeof JsonString.Type;
export const JsonString = S.NonEmptyString.pipe(S.brand("JsonString"));

export const PrimitiveType =
  S.Union(S.String, S.Number, S.Boolean, S.UndefinedOr(S.Null));

export const PrimitiveTypeOrArray =
  S.Union(PrimitiveType, S.Array(PrimitiveType))

export class Column
  extends S.Class<Column>("Column")({
    columnName: S.NonEmptyString,
    description: S.NonEmptyString.pipe(S.optional)
  }) { };

export type CsvCompatibleObject = typeof CsvCompatibleObject.Type;
export const CsvCompatibleObject =
  S.Record({ key: S.NonEmptyString, value: PrimitiveTypeOrArray })

export type DataReplacer = (key: string, value: unknown) => unknown | undefined;

export const DataReplacerOmitUnderscore: DataReplacer = (key, value) =>
  key.startsWith("_") ? undefined : value;
