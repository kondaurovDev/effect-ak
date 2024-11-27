import * as Sdk from "@aws-sdk/client-apigatewayv2";
import * as Brand from "effect/Brand";
import * as S from "effect/Schema";

import { QueueMessage } from "../../../sqs/queue-message/index.js"
import { DeliveryDelay, QueueName } from "../../../sqs/queue/types/index.js"

export type SdkIntegration = Sdk.Integration & Brand.Brand<"Integration">;
export const SdkIntegration = Brand.nominal<SdkIntegration>();

export type IntegrationDescription = typeof IntegrationDescription.Type;
export const IntegrationDescription = S.NonEmptyString.pipe(S.brand("IntegrationDescription"));

export type IntegrationId = typeof IntegrationId.Type;
export const IntegrationId = S.NonEmptyString.pipe(S.brand("IntegrationId"));

export type IntegrationName = typeof IntegrationName.Type

export const IntegrationName =
  S.NonEmptyString.pipe(S.brand("IntegrationName"))

export type SdkUpdateIntegrationCommandInput =
  Required<
    Pick<
      Sdk.UpdateIntegrationCommandInput,
      "ApiId" | "IntegrationType" | "IntegrationSubtype" | "PayloadFormatVersion" |
      "CredentialsArn" | "RequestParameters" | "Description" | "TimeoutInMillis"
    >
  > & Brand.Brand<"CreateOrUpdateSQSIntegration">

export const UpdateIntegrationSdkCommandInput = 
  Brand.nominal<SdkUpdateIntegrationCommandInput>();

  export const UserIntegrationId = 
  S.NonEmptyString.annotations({
    title: "Unique id"
  })

export type SendSqsMessageIntegration = typeof SendSqsMessageIntegration.Type
export const SendSqsMessageIntegration =
  S.Struct({
    id: UserIntegrationId,
    queueName: QueueName,
    action: S.Literal("sendMessageToQueue"),
    message: QueueMessage,
    delay: DeliveryDelay.pipe(S.optional)
  }).annotations({
    title: "SendSqsMessageIntegration",
    description: "Sends messages to SQS"
  })

export type CallLambdaIntegration = typeof CallLambdaIntegration.Type;
export const CallLambdaIntegration =
  S.Struct({
    id: UserIntegrationId,
    action: S.Literal("callFunction"),
    functionName: S.String,
    timeout: S.Positive
  }).annotations({
    identifier: "RunFunction",
    description: "Runs synchronously lambda functions"
  })

export type HttpIntegration = typeof HttpIntegration.Type;
export const HttpIntegration = 
  S.Union(
    SendSqsMessageIntegration,
    CallLambdaIntegration
  )

