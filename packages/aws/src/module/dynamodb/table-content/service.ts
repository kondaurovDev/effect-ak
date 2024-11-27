import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type * as Sdk from "@aws-sdk/client-dynamodb";

import { DynamoDbClient } from "../client.js";

export class DynamoDbTableContentService
  extends Effect.Service<DynamoDbTableContentService>()("DynamoDbTableContentService", {
    effect:
      Effect.gen(function* () {

        const ddb = yield* DynamoDbClient;

        const marshallUnknown = (
          input: unknown,
          convertTopLevelContainer: boolean
        ) => {
          return Effect.try(() =>
            marshall(input, {
              convertTopLevelContainer,
              convertClassInstanceToMap: true,
              convertEmptyValues: true,
              removeUndefinedValues: true
            })
          )
        }
      
        const marshallKey = (
          key: Record<string, string | number>
        ) =>
          marshallUnknown(key, false)
      
        const updateItem = (
          command: Sdk.UpdateItemCommandInput
        ) =>
          ddb.execute(
            "put item", _ =>
            _.updateItem(command)
          )
      
        const putItem = (
          command: Sdk.PutItemCommandInput
        ) =>
          ddb.execute(
            "put item", _ =>
            _.putItem(command)
          )
      
        const query = (
          command: Sdk.QueryCommandInput
        ) =>
          pipe(
            ddb.execute(
              "query items", _ =>
              _.query(command)
            ),
            Effect.andThen(_ => _.Items ?? []),
            Effect.andThen(
              Effect.forEach(item =>
                Effect.try(() => unmarshall(item))
              )
            )
          );
      
        const batchWrite = (
          command: Sdk.BatchWriteItemCommandInput
        ) =>
          ddb.execute(
            "batch write items", _ =>
            _.batchWriteItem(command)
          )
      
        /**
         * Returns an item with the given primary key
         * 
         * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html
         */
        const getOne = (
          command: Sdk.GetItemCommandInput
        ) =>
          pipe(
            ddb.execute(
              "get item", _ =>
              _.getItem(command)
            ),
            Effect.andThen(_ => _.Item),
            Effect.andThen(item =>
              item == null ?
                Effect.succeed(undefined) :
                Effect.try(() => unmarshall(item)),
            )
          )
      
        /**
         * Deletes a single item by primary key
         * 
         * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html
         */
        const deleteItem = (
          command: Sdk.DeleteItemCommandInput
        ) =>
          pipe(
            ddb.execute(
              "delete item", _ =>
              _.deleteItem(command)
            )
          )
      
        return {
          putItem, query, batchWrite, getOne,
          updateItem, marshallUnknown, marshallKey,
          deleteItem
        } as const;

      }), 
      dependencies: [
        DynamoDbClient.Default
      ]
  }) {}
