import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Context, Effect, Layer } from "effect";
import { AwsRegion } from "@efkit/shared";

export const Service =
  Context.GenericTag<DynamoDB>("AWS.ApiGateway")

export const ServiceLive =
  Layer.effect(
    Service,
    Effect.Do.pipe(
      Effect.bind("region", () => AwsRegion),
      Effect.bind("client", ({ region }) =>
        Effect.try(() =>
          new DynamoDB({ region })
        )
      ),
      Effect.andThen(({ client }) =>
        client
      )
    )
  )

