import { Effect, pipe } from "effect";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as Sdk from "@aws-sdk/client-dynamodb";

import * as D from "./types.js";
import { getProjectionAndAttributeNames, getUpdateExpression } from "./utils/index.js";
import { Service, ServiceLive } from "./service.js"
import { DynamoDbError } from "./errors.js";
import { tryAwsServiceMethod } from "../error.js";

export const putItem = (
  tableName: D.TableName,
  item: D.AnyItem
) =>
  Effect.Do.pipe(
    Effect.bind("marshalledItem", () =>
      Effect.try(() => marshall(item)),
    ),
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
  attrsToGet: D.AttrsToGet
) =>
  Effect.Do.pipe(
    Effect.let("request", () => ({
      TableName: tableName,
    } as Partial<Sdk.GetItemCommandInput>)),
    Effect.tap(({ request }) => {
      const projection = getProjectionAndAttributeNames(attrsToGet);
      request.ExpressionAttributeNames = projection.attributeNames;
      request.ProjectionExpression = projection.projectionExpression;
    }),
    Effect.tap(({ request }) =>
      pipe(
        Effect.try(() => marshall(key)),
        Effect.tap(v => { request.Key = v; })
      ),
    ),
    Effect.bind("dynamoSDK", () => Service),
    Effect.andThen(({ dynamoSDK, request }) =>
      tryAwsServiceMethod(
        `get item from ${tableName}`, 
        () => 
          dynamoSDK.getItem(request as Sdk.GetItemCommandInput)
      )
    ),
    Effect.andThen(({ Item }) => {
      if (!Item) return new DynamoDbError({ message: `item not found in ${tableName}` });
      return Effect.try(() => unmarshall(Item))
    }),
    Effect.provide(ServiceLive)
  )

export const updateOne = (
  tableName: D.TableName,
  key: D.Key,
  update: D.AnyItem,
  returnValue?: D.ReturnValue,
) =>
  Effect.Do.pipe(
    Effect.let("request", () => ({
      TableName: tableName,
      ReturnValues: returnValue ?? "NONE"
    }) as Partial<Sdk.UpdateItemCommandInput>),
    Effect.bind("marshalledKey", () => 
      Effect.try(() => marshall(key))
    ),
    Effect.bind("updateExpression", () =>
      getUpdateExpression(update)
    ),
    Effect.tap(({ marshalledKey, updateExpression, request }) => {
      request.Key = marshalledKey;
      request.UpdateExpression = `SET ${updateExpression.expressionParts.join(",")}`;
      request.ExpressionAttributeNames = updateExpression.attributeNames;
      request.ExpressionAttributeValues = updateExpression.attributeValues;
    }),
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
