
import { Context, Layer, Effect } from "effect"
import { SSM } from "@aws-sdk/client-ssm"

import { AwsRegion } from "../region.js";

export const Service =
  Context.GenericTag<SSM>("AWS.SSM")

export const ServiceLive =
  Layer.effect(
    Service,
    Effect.Do.pipe(
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