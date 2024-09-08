
import { Context, Layer, Effect, pipe } from "effect"
import { SSM } from "@aws-sdk/client-ssm"

import { AwsRegion } from "../region.js";

export const Service =
  Context.GenericTag<SSM>("AWS.SSM")

export const ServiceLive =
  Layer.scoped(
    Service,
    pipe(
      Effect.Do,
      Effect.bind("region", () => AwsRegion),
      Effect.bind("client", ({ region }) =>
        Effect.try(() =>
          new SSM({ region: region })
        )
      ),
      Effect.andThen(({ client }) =>
        client
      )
    )
  )