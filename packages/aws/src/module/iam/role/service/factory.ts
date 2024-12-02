import { Effect } from "effect";

import * as S from "../schema/_export.js";
import { CoreConfigurationProviderService } from "#/core/index.js";

export class IamRoleFactoryService
  extends Effect.Service<IamRoleFactoryService>()("IamRoleFactoryService", {
    effect:
      Effect.gen(function* () {

        const { projectId, getAccountId } = yield* CoreConfigurationProviderService;

        const makeRole =
          (input: {
            roleName: string
          }) =>
            Effect.gen(function* () {

              const name = `${projectId}/${projectId}-${input.roleName}`;
              const accountId = yield* getAccountId;

              const arn = 
                S.makeIamRoleArnFrom({
                  accountId,
                  name
                })
              
              const result =
                S.IamRoleMetadata.make({
                  name, arn
                })

              return result
            });

        return {
          makeRole
        } as const;

      }),

      dependencies: [
        CoreConfigurationProviderService.Default
      ]
  }) { }