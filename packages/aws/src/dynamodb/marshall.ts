import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { Effect, pipe } from "effect";

import { marshall, marshallOptions, unmarshall, unmarshallOptions } from "@aws-sdk/util-dynamodb";

export const marshallItem = (
  item: unknown,
  options?: marshallOptions
) =>
  pipe(
    Effect.try(() => marshall(item, options))
  )

export const unmarshallItem = (
  item: Record<string, AttributeValue>,
  options?: unmarshallOptions
) =>
  pipe(
    Effect.try(() => unmarshall(item, options))
  )
