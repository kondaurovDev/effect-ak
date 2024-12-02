import { Effect, Deferred, Schema as S, ParseResult, pipe } from "effect";

import { StsClientException, StsClientService } from "#/clients/sts.js";
import { AwsProjectIdConfig, AwsRegionConfig } from "#/core/configs.js";
import { awsSdkPackageName } from "#/core/const.js";

export class CoreConfigurationProviderService
  extends Effect.Service<CoreConfigurationProviderService>()("CoreConfigurationProviderService", {
    effect:
      Effect.gen(function* () {

        const sts = yield* StsClientService;
        const projectId = yield* AwsProjectIdConfig;
        const region = yield* AwsRegionConfig;

        const accountIdDeferred = yield* Deferred.make<number, StsClientException | ParseResult.ParseError>();

        const getAccountId =
          pipe(
            accountIdDeferred,
            Deferred.complete(
              sts.execute(
                "getCallerIdentity",
                {}
              ).pipe(
                Effect.andThen(_ => S.decodeUnknown(S.NumberFromString)(_.Account)),
              )
            ),
            Effect.andThen(
              Deferred.await(accountIdDeferred)
            )
          )

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
          getAccountId,
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
