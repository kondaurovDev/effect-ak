import { S3 } from "@aws-sdk/client-s3"
import { Context, Layer, Effect } from "effect"
import { AwsRegion } from "@efkit/shared";

export const Service = 
  Context.GenericTag<S3>("AWS.S3");

export const ServiceLive = 
  Layer.effect(
    Service,
    Effect.Do.pipe(
      Effect.bind("region", () => AwsRegion),
      Effect.bind("client", ({ region }) =>
        Effect.try(() =>
          new S3({ region })
        )
      ),
      Effect.andThen(({ client }) =>
        client
      )
    )
  )