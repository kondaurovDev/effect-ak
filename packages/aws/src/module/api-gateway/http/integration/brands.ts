import type * as Sdk from "@aws-sdk/client-apigatewayv2";
import * as Brand from "effect/Brand";

import type { SetRequired } from "type-fest";

export type SendMessageIntegrationInput =
  (
    SetRequired<Sdk.UpdateIntegrationCommandInput, "IntegrationType"> |
    Sdk.CreateIntegrationCommandInput
  ) & Brand.Brand<"SendMessageIntegrationInput">;

export const SendMessageIntegrationInput = Brand.nominal<SendMessageIntegrationInput>();

export type SdkIntegration = Brand.Branded<Sdk.Integration, "Integration">;
export const SdkIntegration = Brand.nominal<SdkIntegration>();

export type IntegrationDescription = Brand.Branded<Sdk.Integration, "IntegrationDescription">;
export const IntegrationDescription = Brand.nominal<IntegrationDescription>();

export type IntegrationId = Brand.Branded<string, "IntegrationId">;
export const IntegrationId = Brand.nominal<IntegrationId>();

export type IntegrationName = Brand.Branded<string, "IntegrationName">;
export const IntegrationName = Brand.nominal<IntegrationName>();

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
