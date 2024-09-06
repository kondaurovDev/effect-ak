import { Schema as S } from "@effect/schema"
import { Context } from "effect"

export type AwsRegionSchema = typeof AwsRegionSchema.Type

export const AwsRegionSchema =
  S.TemplateLiteral(S.String, S.Literal("-"), S.String, S.Literal("-"), S.Number)

export class AwsRegion 
  extends Context.Tag("AwsRegion")<AwsRegion, AwsRegionSchema>() {}
