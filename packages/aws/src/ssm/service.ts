
import { Context, Layer, Effect } from "effect"
import { SSM } from "@aws-sdk/client-ssm"
import { AwsRegion } from "@efkit/shared";

export const Service =
  Context.GenericTag<SSM>("AWS.SSM")

export const ServiceLive =
  Layer.effect(
    Service,
    Effect.Do.pipe(
      Effect.bind("region", () => AwsRegion),
      Effect.bind("client", ({ region }) =>
        Effect.try(() =>
          new SSM({
            region: region.value
          })
        )
      ),
      Effect.andThen(({ client }) =>
        client
      )
    )
  )