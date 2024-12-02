import { Schema } from "effect";

import { LambdaFunctionMetadata } from "#/module/lambda/function/schema/metadata.js";
import { QueueMetadata } from "#/module/sqs/queue/index.js";
import { LambdaEventSource } from "./event-source.js";

export class LambdaEventSourceUpsertQueueCommand
  extends Schema.Class<LambdaEventSourceUpsertQueueCommand>(
    "LambdaEventSourceUpsertQueueCommand"
  )({
    functionName: LambdaFunctionMetadata.fields.name,
    queueArn: QueueMetadata.fields.arn,
    eventSource: LambdaEventSource
  }) {};
