import { Context, Layer } from "effect"
import { Schema as S } from "@effect/schema"

export type AwsRegionValue = typeof AwsRegionValue.Type
export const AwsRegionValue = S.NonEmptyString.annotations({ title: "AWS region" })

export class AwsRegion extends
  Context.Tag("AwsRegion")<
    AwsRegion,
    {
      value: AwsRegionValue
    }
  >() {}

export const AwsRegionLive = (
  region: AwsRegionValue
) =>
  Layer.succeed(
    AwsRegion,
    AwsRegion.of({
      value: region
    })
  )
