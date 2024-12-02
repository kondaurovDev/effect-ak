import * as Effect from "effect/Effect";
import * as Cause from "effect/Cause";
import type { EventSourcePosition } from "@aws-sdk/client-lambda";

import { LambdaClientService, LambdaMethodInput } from "#/clients/lambda.js";
import { DynamodbStreamsClientService } from "#/clients/dynamodb-streams.js";
import { LambdaEventSourceViewService } from "./view.js";
import { LambdaFunctionName } from "../../function/schema.js";

// https://docs.aws.amazon.com/lambda/latest/api/API_CreateEventSourceMapping.html

export class LambdaEventSourceStreamService
  extends Effect.Service<LambdaEventSourceStreamService>()("LambdaEventSourceStreamService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* LambdaClientService;
        const streams = yield* DynamodbStreamsClientService;
        const view = yield* LambdaEventSourceViewService;

        const upsertDynamoDbStream =
          (input: {
            functionName: LambdaFunctionName,
            tableName: string,
            position: EventSourcePosition,
            partialResponse: boolean
          }) =>
            Effect.gen(function* () {

              const streamArn = 
                (yield* streams.execute(
                  "listStreams",
                  {
                    TableName: input.tableName
                  }
                )).LastEvaluatedStreamArn;

              if (!streamArn) {
                yield* Effect.logWarning(`Table '${input.tableName}' does not exist or table's stream has not been created`)
                return false;
              }

              const currentId = yield* view.getIdByFunctionName(input);

              const commandInput: LambdaMethodInput<"createEventSourceMapping"> = {
                FunctionName: input.functionName,
                EventSourceArn: streamArn,
                StartingPosition: input.position,
                BatchSize: 10,
                ...(input.partialResponse ? {
                  FunctionResponseTypes: [
                    "ReportBatchItemFailures"
                  ]
                } : undefined)
              }

              if (currentId == null) {
                const response = 
                yield* lambda.execute(
                  "createEventSourceMapping",
                  {
                    ...commandInput
                  }
                );
                if (!response.UUID) return new Cause.RuntimeException("UUID is undefined")
                return response.UUID;
              }

              yield* lambda.execute(
                "updateEventSourceMapping",
                {
                  UUID: currentId,
                  ...commandInput
                }
              );

              return currentId;
                

            });

        return {
          upsertDynamoDbStream
        } as const;

      }),

    dependencies: [
      LambdaClientService.Default,
      LambdaEventSourceViewService.Default,
      DynamodbStreamsClientService.Default
    ]
  }) { }
