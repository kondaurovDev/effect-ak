import { Schema as S } from "@effect/schema"

export type DecodedFromJson = typeof DecodedFromJson.Type;
export const DecodedFromJson = S.Unknown.pipe(S.brand("DecodedFromJson"));

export type EncodedToJson = typeof EncodedToJson.Type;
export const EncodedToJson = S.NonEmptyString.pipe(S.brand("EncodedToJson"));

export const PrimitiveType =
  S.Union(S.String, S.Number, S.Boolean, S.UndefinedOr(S.Null));

export const PrimitiveTypeOrArray =
  S.Union(PrimitiveType, S.Array(PrimitiveType))

export class Column
  extends S.Class<Column>("Column")({
    columnName: S.NonEmptyString,
    description: S.NonEmptyString
  }) { };

export type CsvCompatibleObject = typeof CsvCompatibleObject.Type;
export const CsvCompatibleObject =
  S.Record({ key: S.NonEmptyString, value: PrimitiveTypeOrArray })

export type DataReplacer = (key: string, value: unknown) => unknown | undefined;

export const DataReplacerOmitUnderscore: DataReplacer = (key, value) =>
  key.startsWith("_") ? undefined : value;
