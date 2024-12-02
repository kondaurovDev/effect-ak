import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import type * as Sdk from "@aws-sdk/client-dynamodb";

import { DynamodbClientService } from "#/clients/dynamodb.js";

export class DynamoDbManageService
  extends Effect.Service<DynamoDbManageService>()("DynamoDbManageService", {
    effect:
      Effect.gen(function* () {

        const client = yield* DynamodbClientService;

        const createTable = (
          commandInput: Sdk.CreateTableCommandInput
        ) =>
          pipe(
            client.execute(
              "createTable",
              commandInput
            )
          )

        const updateTable = (
          commandInput: Sdk.UpdateTableCommandInput
        ) =>
          pipe(
            client.execute(
              "updateTable",
              commandInput
            )
          )

        return {
          createTable, updateTable
        } as const;

      }),
      dependencies: [
        DynamodbClientService.Default
      ]
  }) { }
