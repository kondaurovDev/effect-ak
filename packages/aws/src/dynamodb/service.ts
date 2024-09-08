import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Context, Effect, Layer, pipe } from "effect";

import { AwsRegion } from "../region.js";

export type _DynamoDbClient = DynamoDB

export class AwsDynamoDb extends 
  Context.Tag("AWS.DynamoDb")<AwsDynamoDb, _DynamoDbClient>() {}

export const AwsDynamoDbLive =
  Layer.effect(
    AwsDynamoDb,
    pipe(
      Effect.Do,
      Effect.bind("region", () => AwsRegion),
      Effect.andThen(({ region }) =>
        Effect.try(() =>
          new DynamoDB({ region })
        )
      )
    )
  )

