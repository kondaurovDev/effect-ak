import { Context, pipe, Layer } from "effect"
import { Schema as S } from "@effect/schema"

type RegionSchema = typeof RegionSchema.Type
const RegionSchema = S.NonEmptyString.annotations({ title: "AWS region" })

export class AwsRegion extends
  Context.Tag("AwsRegion")<
    AwsRegion,
    {
      regionName: RegionSchema
    }
  >() {}

export const AwsRegionLive = (
  regionName: RegionSchema
) =>
  Layer.succeed(
    AwsRegion,
    AwsRegion.of({
      regionName
    })
  )
