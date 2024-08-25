import { Context, Layer, Effect } from "effect"
import { KMS } from "@aws-sdk/client-kms"
import { AwsRegion } from "@efkit/shared";

export const Service =
  Context.GenericTag<KMS>("AWS.KMS")

export const ServiceLive =
  Layer.effect(
    Service,
    Effect.Do.pipe(
      Effect.bind("region", () => AwsRegion),
      Effect.bind("client", ({ region }) =>
        Effect.try(() =>
          new KMS({
            region: region.value
          })
        )
      ),
      Effect.andThen(({ client }) =>
        client
      )
    )
  )