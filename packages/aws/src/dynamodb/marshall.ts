import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { Data, Effect, pipe } from "effect";

import { marshall, marshallOptions, unmarshall, unmarshallOptions } from "@aws-sdk/util-dynamodb";

export class MarshallError 
  extends Data.TaggedError("MarshallingError")<{
    cause: unknown,
    operation: "marshall" | "unmarshall",
    itemName: string
  }> {}

export const marshallItem = (
  item: unknown,
  itemName: string,
  options: marshallOptions = { convertTopLevelContainer: true },
) =>
  pipe(
    Effect.try({
      try: () => marshall(item, options),
      catch: (error) => new MarshallError({ cause: error, operation: "marshall", itemName }), 
    })
  )

export const unmarshallItem = (
  item: Record<string, AttributeValue>,
  itemName: string,
  options?: unmarshallOptions
) =>
  pipe(
    Effect.try({
      try: () => unmarshall(item, options),
      catch: (error) => new MarshallError({ cause: error, operation: "unmarshall", itemName }), 
    })
  )
