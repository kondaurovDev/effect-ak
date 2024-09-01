import { Context, Layer } from "effect"
import { Schema as S } from "@effect/schema";

export type AwsRegionSchema = typeof AwsRegionSchema.Type

export const AwsRegionSchema =
  S.TemplateLiteral(S.String, S.Literal("-"), S.String, S.Literal("-"), S.Number)

export class AwsRegion extends
  Context.Tag("AwsRegion")<AwsRegion, AwsRegionSchema>() {

    static createLayer(region: AwsRegionSchema) {
      return Layer.succeed(
        AwsRegion,
        AwsRegion.of(region)
      )
    }

  }

