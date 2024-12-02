import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import type * as Sdk from "@aws-sdk/client-dynamodb";

import { DynamodbClientService } from "#/clients/dynamodb.js";

export class DynamoDbViewService
  extends Effect.Service<DynamoDbViewService>()("DynamoDbViewService", {
    effect:
      Effect.gen(function* () {

        const ddb = yield* DynamodbClientService;

        const listTableNames = (
          input: Sdk.ListTablesCommandInput
        ) =>
          pipe(
            ddb.execute(
              "listTables",
              input
            ),
            Effect.andThen(_ => _.TableNames ?? [])
          )

        return {
          listTableNames
        } as const;

      }),
      dependencies: [
        DynamodbClientService.Default
      ]
  }) { }
