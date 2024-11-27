import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import type * as Sdk from "@aws-sdk/client-dynamodb";

import { DynamoDbClient } from "../../client.js";

export class DynamoDbViewService
  extends Effect.Service<DynamoDbViewService>()("DynamoDbViewService", {
    effect:
      Effect.gen(function* () {

        const ddb = yield* DynamoDbClient;

        const listTableNames = (
          input: Sdk.ListTablesCommandInput
        ) =>
          pipe(
            ddb.execute(
              "list tables", _ =>
              _.listTables(input)
            ),
            Effect.andThen(_ => _.TableNames ?? [])
          )

        return {
          listTableNames
        } as const;

      }),
      dependencies: [
        DynamoDbClient.Default
      ]
  }) { }
