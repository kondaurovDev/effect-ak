import { describe, it, assert } from "vitest";
import { Effect, Equal } from "effect";

import { Utils } from "@effect-ak/misc"

import * as Iam from "#/module/iam/index.js";
import { AwsProjectIdConfig } from "#/core/index.js";

describe("iam role service", () => {

  it("check quality of role policy document", async () => {

    const program =
      await Effect.gen(function* () {

        const factory = yield* Iam.IamRolePolicyFactoryService;

        const a1 =
          factory.makeAssumeDocument({
            serviceName: "lambda"
          });

        const a2 =
          factory.makeAssumeDocument({
            serviceName: "lambda"
          });

        const a3 =
          factory.makeAssumeDocument({
            serviceName: "ecs-tasks"
          });

        assert(Equal.equals(a1, a2));
        assert(Equal.equals(a1, a3) == false);

      }).pipe(
        Effect.provide([
          Iam.IamRolePolicyFactoryService.Default
        ]),
        Effect.tapErrorCause(error =>
          Effect.logError("some error", error)
        ),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

    return 1;

  })

  it("upsert role", async () => {

    const actual =
      await Effect.gen(function* () {

        const manageRole = yield* Iam.IamRoleManageService;

        const projectId = yield* AwsProjectIdConfig;

        const input = {
          roleName: "lambda-bar"
        } as const;

        const roleName =
          yield* manageRole.upsertRole({
            roleName: input.roleName,
            serviceName: "lambda"
          });

        assert(roleName.endsWith(`${projectId}-lambda-bar`))

      }).pipe(
        Effect.provide([
          Iam.IamRoleManageService.Default,
        ]),
        Effect.provide([
          Utils.LogLevelConfigFromEnv,
        ]),
        Effect.tapErrorCause(error =>
          Effect.logError("some error", error)
        ),
        Effect.runPromiseExit
      );

    assert(actual._tag == "Success")

  });

  it("upsert role's resource policy", async () => {

    const actual =
      await Effect.gen(function* () {

        const manageRole = yield* Iam.IamRoleManageService;

        yield* manageRole.upsertRoleResourcePolicy({
          roleName: `lambda1`,
          actions: "asd222:asd123",
          resources: "*",
          policyName: "default"
        });

      }).pipe(
        Effect.provide([
          Iam.IamRoleManageService.Default,
        ]),
        Effect.provide([
          Utils.LogLevelConfigFromEnv,
        ]),
        Effect.tapErrorCause(error =>
          Effect.logError("some error", error)
        ),
        Effect.runPromiseExit
      );

    assert(actual._tag == "Success")

  });

})
