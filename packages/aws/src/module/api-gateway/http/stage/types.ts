import * as Brand from "effect/Brand";
import * as S from "effect/Schema";;

export type HttpApiStage =
  typeof HttpApiStage.Type

export const HttpApiStage =
  S.Struct({
    autoDeploy: S.Boolean,
    variables: S.Record({ key: S.String, value: S.String }),
  })

export type StageName = Brand.Branded<string, "StageName">;
export const StageName = Brand.nominal<StageName>();
