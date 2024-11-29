import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import * as Match from "effect/Match";

import { Apigatewayv2ClientService } from "#clients/apigatewayv2.js";
import type { QueueUrl } from "#module/sqs/index.js";
import { HttpApiGatewayIntegrationViewService } from "./view.js";
import type { ApiGatewayHttpIntegrationSendSqsMessage } from "../schema/integration.js";
import { SendMessageIntegrationInput } from "../brands.js";

export class ApiGatewayHttpIntegrationSqsService
  extends Effect.Service<ApiGatewayHttpIntegrationSqsService>()("ApiGatewayHttpIntegrationSqsService", {
    effect:
      Effect.gen(function* () {

        const client = yield* Apigatewayv2ClientService;
        const view = yield* HttpApiGatewayIntegrationViewService;

        // https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference-access-logging-only

        const upsertSendMessageIntegration =
          (input: {
            name: string,
            queueUrl: QueueUrl,
            integration: ApiGatewayHttpIntegrationSendSqsMessage
          }) =>
            Effect.gen(function* () {

              // const queueUrl =
              //   sqsContext.getQueueUrlByName(queue.sdkQueueName);

              // const iamRole =
              //   yield* upsertRole;

              // const current =
              //   yield* pipe(
              //     view.getSqsIntegrations(input),
              //     Effect.andThen(list =>
              //       list.find(_ =>
              //         _.Description?.toLowerCase() == integration.id.toLowerCase()
              //       )
              //     )
              //   )

              const commandInput =
                SendMessageIntegrationInput({
                  IntegrationId: undefined,
                  ApiId: input.apiId,
                  IntegrationType: "AWS_PROXY",
                  IntegrationSubtype: "SQS-SendMessage",
                  PayloadFormatVersion: "1.0",
                  CredentialsArn: iamRole,
                  Description: integration.id,
                  TimeoutInMillis: 3000,
                  RequestParameters: {
                    ...getMessageSdkAttributes(integration.message),
                    MessageAttributes: JSON.stringify(integration.message.attributes),
                    QueueUrl: queueUrl
                  } as unknown as Record<string, string>
                })

              const integrationId =
                yield* pipe(
                  Match.value(current),
                  Match.when(
                    Match.defined,
                    integration =>
                      pipe(
                        gw.executeMethod(
                          "update http integration", _ =>
                          _.send(
                            new Sdk.UpdateIntegrationCommand({
                              ...commandInput, IntegrationId: integration.IntegrationId
                            })
                          )
                        ),
                        Effect.tap(result =>
                          Effect.logDebug("update result", result)
                        ),
                        Effect.andThen(_ =>
                          S.validate(IntegrationId)(_.IntegrationId)
                        ),
                        Effect.andThen(IntegrationId.make)
                      )
                  ),
                  Match.orElse(() =>
                    pipe(
                      gw.executeMethod(
                        "create http integration with aws", _ =>
                        _.send(
                          new Sdk.CreateIntegrationCommand(commandInput)
                        )
                      ),
                      Effect.andThen(_ =>
                        S.validate(IntegrationId)(_.IntegrationId)
                      ),
                      Effect.andThen(IntegrationId.make)
                    )
                  ),
                )

              return integrationId;

            });

        const upsertRole =
          roleService.upsertRole(
            Iam.RoleName.make("http-gateway-integration"),
            Iam.createPolicyDocument(
              Iam.createAssumeRoleStatement("apigateway"),
              Iam.createResourceStatement(
                Iam.StatementEffect("Allow"),
                [
                  Iam.StatementAction("sqs:GetQueueAttributes"),
                  Iam.StatementAction("sqs:GetQueueUrl"),
                  Iam.StatementAction("sqs:SendMessage"),
                ],
                [
                  Iam.StatementResource("*")
                ]
              )
            )
          );

        return {
          upsertIntegration, upsertRole
        } as const;

      })

  }) { }
