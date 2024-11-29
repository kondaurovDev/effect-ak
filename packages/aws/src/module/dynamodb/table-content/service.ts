import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { DynamodbClientService, DynamodbMethodInput } from "#clients/dynamodb.js";

export class DynamoDbTableContentService
  extends Effect.Service<DynamoDbTableContentService>()("DynamoDbTableContentService", {
    effect:
      Effect.gen(function* () {

        const client = yield* DynamodbClientService;

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
          command: DynamodbMethodInput<"updateItem">
        ) =>
          client.execute(
            "updateItem",
            command
          )
      
        const putItem = (
          command: DynamodbMethodInput<"putItem">
        ) =>
          client.execute(
            "putItem",
            command
          )
      
        const query = (
          command: DynamodbMethodInput<"query">
        ) =>
          pipe(
            client.execute(
              "query",
              command
            ),
            Effect.andThen(_ => _.Items ?? []),
            Effect.andThen(
              Effect.forEach(item =>
                Effect.try(() => unmarshall(item))
              )
            )
          );
      
        const batchWrite = (
          command: DynamodbMethodInput<"batchWriteItem">
        ) =>
          client.execute(
            "batchWriteItem",
            command
          )
      
        /**
         * Returns an item with the given primary key
         * 
         * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html
         */
        const getOne = (
          command: DynamodbMethodInput<"getItem">
        ) =>
          pipe(
            client.execute(
              "getItem",
              command
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
          command: DynamodbMethodInput<"deleteItem">
        ) =>
          pipe(
            client.execute(
              "deleteItem",
              command
            )
          )
      
        return {
          putItem, query, batchWrite, getOne,
          updateItem, marshallUnknown, marshallKey,
          deleteItem
        } as const;

      }), 
      dependencies: [
        DynamodbClientService.Default
      ]
  }) {}
