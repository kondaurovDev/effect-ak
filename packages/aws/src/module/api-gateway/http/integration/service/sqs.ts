import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import * as Match from "effect/Match";
import * as Sdk from "@aws-sdk/client-apigatewayv2";
import type { SetRequired } from "type-fest";

import { ApiId } from "../../main/types.js";
import { IntegrationId, SendSqsMessageIntegration } from "../types.js";
import { ApiGatewayClientService } from "../../client.js";
import { GatewayIntegrationViewService } from "./search.js";
import * as SqsQueue from "../../../../sqs/queue/index.js";
import * as Iam from "../../../iam/index.js";
import { getMessageSdkAttributes } from "../../../../sqs/queue-message/internal/mapper.js";

export class GatewayIntegrationSqsService
  extends Effect.Service<GatewayIntegrationSqsService>()("GatewayIntegrationSqsService", {
    effect:
      Effect.gen(function* () {

        const gw = yield* ApiGatewayClient;
        const view = yield* GatewayIntegrationViewService;
        const sqsContext = yield* SqsQueue.SqsQueueContextService;
        const roleService = yield* Iam.IamRoleEditService;

        // https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference-access-logging-only

        const upsertIntegration = (
          apiId: ApiId,
          queue: SqsQueue.OneOfQueue,
          integration: SendSqsMessageIntegration
        ) =>
          Effect.gen(function* () {

            const queueUrl =
              sqsContext.getQueueUrlByName(queue.sdkQueueName);

            const iamRole =
              yield* upsertRole;

            const current =
              yield* pipe(
                view.getSqsIntegrations(apiId),
                Effect.andThen(list =>
                  list.find(_ =>
                    _.Description?.toLowerCase() == integration.id.toLowerCase()
                  )
                )
              )

            type Input =
              SetRequired<Sdk.UpdateIntegrationCommandInput, "IntegrationType"> |
              Sdk.CreateIntegrationCommandInput;

            const commandInput: Input = {
              IntegrationId: undefined,
              ApiId: apiId,
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
            }

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
