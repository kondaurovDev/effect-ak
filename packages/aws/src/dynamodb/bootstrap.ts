import { Effect, pipe } from "effect";

import * as D from "./types.js";
import { AwsDynamoDb } from "./service.js"
import { tryAwsServiceMethod } from "../error.js";

export const createTable = (
  tableName: D.TableName,
  attributes: D.AttributeDefinition[],
  key: D.KeySchema[]
) =>
  pipe(
    Effect.Do,
    Effect.bind("dynamoSDK", () => AwsDynamoDb),
    Effect.andThen(({ dynamoSDK }) =>
      tryAwsServiceMethod(
        `creating table ${tableName}`,
        () =>
          dynamoSDK.createTable({
            TableName: tableName,
            BillingMode: "PAY_PER_REQUEST",
            AttributeDefinitions: attributes,
            KeySchema: key
          })
      )
    )
  );