import { Effect } from "effect";

import * as D from "./types.js";
import { Service, ServiceLive } from "./service.js"
import { tryAwsServiceMethod } from "../error.js";

export const createTable = (
  tableName: D.TableName,
  billingMode: D.BillingMode,
  attributes: D.AttributeDefinition[],
  key: D.KeySchema[]
) =>
  Effect.Do.pipe(
    Effect.bind("dynamoSDK", () => Service),
    Effect.andThen(({ dynamoSDK }) =>
      tryAwsServiceMethod(
        `creating table ${tableName}`,
        () =>
          dynamoSDK.createTable({
            TableName: tableName,
            BillingMode: billingMode,
            AttributeDefinitions: attributes,
            KeySchema: key
          })
      )
    ),
    Effect.provide(ServiceLive)
  );