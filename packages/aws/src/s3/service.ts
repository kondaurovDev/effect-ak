import { S3 } from "@aws-sdk/client-s3"
import { Context, Layer, Effect, pipe } from "effect"

import { AwsRegion } from "../region.js";

export const Service = 
  Context.GenericTag<S3>("AWS.S3");

export const ServiceLive = 
  Layer.scoped(
    Service,
    pipe(
      Effect.Do,
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