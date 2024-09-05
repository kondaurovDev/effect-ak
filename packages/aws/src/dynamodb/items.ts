import { Effect, Match, pipe } from "effect";
import type * as Sdk from "@aws-sdk/client-dynamodb";

import * as D from "./types.js";
import { getProjectionAndAttributeNames, getUpdateExpression } from "./utils/index.js";
import { Service, ServiceLive } from "./service.js"
import { DynamoDbError } from "./errors.js";
import { tryAwsServiceMethod } from "../error.js";
import { marshallItem, unmarshallItem } from "./marshall.js";

export const putItem = (
  tableName: D.TableName,
  item: D.AnyItem
) =>
  pipe(
    Effect.Do,
    Effect.bind("marshalledItem", () => marshallItem(item, tableName)),
    Effect.bind("dynamoSDK", () => Service),
    Effect.andThen(({ dynamoSDK, marshalledItem }) =>
      tryAwsServiceMethod(
        `put one item in ${tableName}`,
        () =>
          dynamoSDK.putItem({
            TableName: tableName,
            Item: marshalledItem
          })
      )
    ),
    Effect.provide(ServiceLive)
  )

export const getOne = (
  tableName: D.TableName,
  key: D.Key,
  attrsToGet: D.AttrsToGet | undefined
) =>
  pipe(
    Effect.Do,
    Effect.bind("key", () => marshallItem(key, tableName)),
    Effect.let("request", ({ key }) =>
      pipe(
        Match.value(attrsToGet),
        Match.when(Match.defined, (attrs) =>
          pipe(
            getProjectionAndAttributeNames(attrs),
            projection =>
              D.GetItemInput({
                TableName: tableName,
                Key: key,
                ExpressionAttributeNames: projection.attributeNames,
                ProjectionExpression: projection.projectionExpression
              })
          )
        ),
        Match.orElse(() =>
          D.GetItemInput({
            TableName: tableName,
            Key: key
          })
        )
      )
    ),
    Effect.bind("dynamoSDK", () => Service),
    Effect.andThen(({ dynamoSDK, request }) =>
      tryAwsServiceMethod(
        `get item from ${tableName}`,
        () => dynamoSDK.getItem(request)
      )
    ),
    Effect.andThen(({ Item }) => {
      if (!Item) return new DynamoDbError({ message: `item not found in ${tableName}` });
      return unmarshallItem(Item, tableName)
    }),
    Effect.provide(ServiceLive)
  )

export const updateOne = (
  tableName: D.TableName,
  key: D.Key,
  update: D.AnyItem,
  returnValue?: D.ReturnValue,
) =>
  pipe(
    Effect.Do,
    Effect.bind("marshalledKey", () => marshallItem(key, tableName)),
    Effect.bind("updateExpression", () => getUpdateExpression(update)),
    Effect.let("request", ({ marshalledKey, updateExpression }) =>
      D.UpdateItemInput({
        TableName: tableName,
        ReturnValues: returnValue ?? "NONE",
        Key: marshalledKey,
        UpdateExpression: `SET ${updateExpression.expressionParts.join(",")}`,
        ExpressionAttributeNames: updateExpression.attributeNames,
        ExpressionAttributeValues: updateExpression.attributeValues
      })
    ),
    Effect.bind("dynamoSDK", () => Service),
    Effect.andThen(({ dynamoSDK, request }) =>
      tryAwsServiceMethod(
        `updateItem in ${tableName}`,
        () =>
          dynamoSDK.updateItem(request as Sdk.UpdateItemCommandInput)
      )
    ),
    Effect.provide(ServiceLive)
  )
