import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import type * as Sdk from "@aws-sdk/client-dynamodb";

import { DynamoDbClient } from "../../client.js";

export class DynamoDbManageService
  extends Effect.Service<DynamoDbManageService>()("DynamoDbManageService", {
    effect:
      Effect.gen(function* () {

        const ddb = yield* DynamoDbClient;

        const createTable = (
          commandInput: Sdk.CreateTableCommandInput
        ) =>
          pipe(
            ddb.execute(
              "create table", _ =>
              _.createTable(commandInput)
            )
          )

        const updateTable = (
          commandInput: Sdk.UpdateTableCommandInput
        ) =>
          pipe(
            ddb.execute(
              "update table", _ =>
              _.updateTable(commandInput)
            )
          )

        return {
          createTable, updateTable
        } as const;

      }),
      dependencies: [
        DynamoDbClient.Default
      ]
  }) { }
