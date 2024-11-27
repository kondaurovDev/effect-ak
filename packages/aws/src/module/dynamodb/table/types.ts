import * as S from "effect/Schema";

const TableAttribute =
  S.Struct({
    name: S.NonEmptyString,
    type: S.Literal("B", "N", "S")
  })

const TableKey = 
  S.Struct({
    primary: TableAttribute,
    secondary: S.optional(TableAttribute)
  })

type GlobalSecondaryIndex = typeof GlobalSecondaryIndex.Type
const GlobalSecondaryIndex =
  S.extend(TableKey)(
    S.Struct({
      indexName: S.String,
      projection: S.Literal("ALL", "INCLUDE", "KEYS_ONLY")
    })
  )

export type TableConfig = typeof TableConfig.Type;
export const TableConfig = 
  S.Struct({
    tableName: S.String,
    billingMode: S.Literal("PAY_PER_REQUEST", "PROVISIONED"),
    primaryKey: TableKey,
    gsi: S.optional(S.Array(GlobalSecondaryIndex))
  })