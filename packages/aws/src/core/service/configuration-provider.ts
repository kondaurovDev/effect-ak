import * as Effect from "effect/Effect";
import * as S from "effect/Schema";

import { StsClientService } from "#clients/sts.js";
import { AwsProjectIdConfig, AwsRegionConfig } from "#core/configs.js";
import { awsSdkPackageName } from "#core/const.js";

export class CoreConfigurationProviderService
  extends Effect.Service<CoreConfigurationProviderService>()("CoreConfigurationProviderService", {
    effect:
      Effect.gen(function* () {

        const sts = yield* StsClientService;
        const projectId = yield* AwsProjectIdConfig;
        const region = yield* AwsRegionConfig;

        const getAccountId =
          sts.execute(
            "getCallerIdentity",
            {}
          ).pipe(
            Effect.andThen(_ => S.decodeUnknown(S.NumberFromString)(_.Account))
          );

        const projectIdKeyName = `${awsSdkPackageName}/projectId`;

        const resourceTags = [
          `${projectIdKeyName}:${projectId}`
        ];

        const resourceTagsMap = {
          [`${projectIdKeyName}`]: projectId
        };

        const resourceTagsKeyValue = [
          { Key: projectIdKeyName, Value: projectId }
        ];

        return {
          region,
          accountId: yield* Effect.cached(getAccountId),
          projectId,
          projectIdKeyName,
          resourceTags,
          resourceTagsMap,
          resourceTagsKeyValue
        }

      }),

    dependencies: [
      StsClientService.Default
    ]
  }) { };
