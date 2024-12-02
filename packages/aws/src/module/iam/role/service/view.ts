import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { IamClientService } from "#/clients/iam.js";
import * as S from "#/module/iam/role-policy/index.js";
import { IamRoleArn } from "../schema.js";

export class IamRoleViewService
  extends Effect.Service<IamRoleViewService>()("IamRoleViewService", {
    effect:
      Effect.gen(function* () {

        const iam = yield* IamClientService;

        const exists =
          (input: {
            roleName: string,
          }) =>
            Effect.andThen(get(input), _ => _ != null);

        const get =
          (input: {
            roleName: string,
          }) =>
            Effect.gen(function* () {

              const response =
                yield* iam.execute(
                  'getRole',
                  {
                    RoleName: input.roleName
                  }
                );

              const role = response.Role;

              if (role == null) {
                return yield* Effect.dieMessage("The role exists but `Role` attribute is undefined")
              }

              return role;

            })

        const getAssumePolicyDocument =
          (input: {
            roleName: string
          }) =>
            Effect.gen(function* () {
              const role = yield* get(input);

              if (role.AssumeRolePolicyDocument == null) {
                return yield* Effect.dieMessage("The role exists but `AssumeRolePolicyDocument` attribute is undefined")
              }

              return yield* Effect.all({
                roleArn: Schema.validate(IamRoleArn)(role.Arn),
                assumePolicy: S.IamRolePolicyDocument.fromJsonString(role.AssumeRolePolicyDocument)
              });

            });

        const getResoucePolicyDocument =
          (input: {
            roleName: string,
            policyName: string
          }) =>
            Effect.gen(function* () {

              const response =
                yield* iam.execute(
                  'getRolePolicy',
                  {
                    RoleName: input.roleName,
                    PolicyName: input.policyName
                  }
                ).pipe(
                  Effect.catchIf(
                    _ => _._tag == "IamClientException" && 
                    _.name == "NoSuchEntityException" &&  
                    _.message.startsWith("The role policy"),
                    () => Effect.succeed(undefined)
                  ),
                  Effect.orDie
                );

                if (response == undefined) {
                  return undefined;
                }

                if (response.PolicyDocument == null) {
                  return yield* Effect.dieMessage("The role's policy exists but `PolicyDocument` attribute is undefined")
                }

              return yield* S.IamRolePolicyDocument.fromJsonString(response.PolicyDocument).pipe(Effect.orDie);

            });

        return {
          exists, get, getResoucePolicyDocument, getAssumePolicyDocument
        } as const;

      }),

    dependencies: [
      IamClientService.Default,
    ]

  }) { }
