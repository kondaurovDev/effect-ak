import * as S from "effect/Schema";

import { DeliveryDelay, QueueMetadata } from "#module/sqs/queue/schema/index.js";
import { QueueMessage } from "#module/sqs/queue-message/schema/index.js";

export class ApiGatewayHttpIntegrationSendSqsMessage 
  extends S.Class<ApiGatewayHttpIntegrationSendSqsMessage>("ApiGatewayHttpIntegrationSendSqsMessage")(
    S.Struct({
      queueUrl: QueueMetadata.fields.url,
      action: S.Literal("sendMessageToSqsQueue"),
      message: QueueMessage,
      delay: DeliveryDelay.pipe(S.optional)
    })
  ) {}

export class ApiGatewayHttpIntegrationCallLambda 
  extends S.Class<ApiGatewayHttpIntegrationCallLambda>("ApiGatewayHttpIntegrationCallLambda")(
    S.Struct({
      action: S.Literal("callLambdaFunction"),
      functionName: S.String,
      timeout: S.Positive
    })
  ) {}

export type ApiGatewayHttpIntegration = 
  typeof ApiGatewayHttpIntegration.Type;

export const ApiGatewayHttpIntegration = 
  S.Union(
    ApiGatewayHttpIntegrationSendSqsMessage,
    ApiGatewayHttpIntegrationCallLambda
  );
