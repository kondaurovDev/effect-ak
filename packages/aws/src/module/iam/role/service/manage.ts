import { Schema, Equal, Effect } from "effect"

import { CoreConfigurationProviderService } from "#/core/index.js"
import { IamClientService } from "#/clients/iam.js"
import * as Policy from "#/module/iam/role-policy/index.js"
import { AwsServiceName } from "#/module/const.js";
import * as S from "../schema/_export.js";
import { IamRoleViewService } from "./view.js";

export class IamRoleManageService
  extends Effect.Service<IamRoleManageService>()("IamRoleManageService", {
    effect:
      Effect.gen(function* () {

        const iam = yield* IamClientService;
        const roleView = yield* IamRoleViewService;
        const { projectId, resourceTagsKeyValue } = yield* CoreConfigurationProviderService;
        const policyFactory = yield* Policy.IamRolePolicyFactoryService;

        yield* Effect.logDebug("IamRoleManageService is ready");

        const makeRoleName = (input: string) => `${projectId}-${input}`

        const upsertRole =
          (input: {
            roleName: S.IamRoleName,
            serviceName: AwsServiceName
          }) =>
            Effect.gen(function* () {

              const roleName = makeRoleName(input.roleName);

              const policyDocument = policyFactory.makeAssumeDocument(input);

              const jsonPolicyDocument =
                yield* Policy.IamRolePolicyDocument.toJsonString(policyDocument)

              const { 
                assumePolicy: currentAssumePolicy,
                roleArn 
              } =
                yield* roleView.getAssumePolicyDocument({ roleName });

              if (Equal.equals(currentAssumePolicy, policyDocument)) {
                yield* Effect.logDebug("Assume policy is up to date. Skipping")
                return roleArn;
              }

              yield* Effect.logDebug("different policy document", { currentAssumePolicy, policyDocument })

              const response =
                yield* iam.execute(
                  "updateAssumeRolePolicy",
                  {
                    PolicyDocument: jsonPolicyDocument,
                    RoleName: roleName
                  }
                );

              yield* Effect.logDebug("Role's assume policy has been updated", {
                statusCode: response.$metadata.httpStatusCode
              });

              return roleArn;

            }).pipe(
              Effect.catchIf(_ => _._tag == "IamClientException" && _.name == "NoSuchEntityException", () =>
                Effect.gen(function* () {

                  const jsonDocument =
                    yield* Policy.IamRolePolicyDocument.toJsonString(policyFactory.makeAssumeDocument(input));

                  const result =
                    yield* iam.execute(
                      "createRole",
                      {
                        RoleName: makeRoleName(input.roleName),
                        Path: `/${projectId}/`,
                        AssumeRolePolicyDocument: jsonDocument,
                        Tags: resourceTagsKeyValue
                      }
                    )

                  return yield* Schema.validate(S.IamRoleMetadata.fields.arn)(result.Role?.Arn);
                })
              )
            )

        const upsertRoleResourcePolicy =
          (input: {
            roleName: S.IamRoleName,
            resources: Policy.IamRolePolicyDocumentResource,
            actions: Policy.IamRolePolicyDocumentAction
            policyName: Policy.IamRolePolicyName,
          }) =>
            Effect.gen(function* () {

              const roleName = makeRoleName(input.roleName);

              const policyDocument = policyFactory.makeAllowResourceDocument(input);

              const currentDefaultPolicyDocument =
                yield* roleView.getResoucePolicyDocument({
                  ...input,
                  roleName
                });

              if (currentDefaultPolicyDocument == null || !Equal.equals(currentDefaultPolicyDocument, policyDocument)) {
                const jsonPolicyDocument =
                  yield* Policy.IamRolePolicyDocument.toJsonString(policyDocument);

                yield* iam.execute(
                  "putRolePolicy", 
                  {
                    RoleName: roleName,
                    PolicyDocument: jsonPolicyDocument,
                    PolicyName: input.policyName,
                  }
                );
                return 1;
              };

              yield* Effect.logDebug("role policy is up to date");
              return 0;

            });

        return {
          upsertRole, upsertRoleResourcePolicy
        } as const;

      }),

    dependencies: [
      IamRoleViewService.Default,
      IamClientService.Default,
      Policy.IamRolePolicyFactoryService.Default,
      CoreConfigurationProviderService.Default
    ]
  }) { }
