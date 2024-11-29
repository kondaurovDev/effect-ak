import * as Effect from "effect/Effect";

import { SsmClientService } from "#clients/ssm.js";
import { CoreConfigurationProviderService } from "#core/service/configuration-provider.js";

export class SsmParameterPlainService
  extends Effect.Service<SsmParameterPlainService>()("SsmParameterPlainService", {
    effect:
      Effect.gen(function* () {

        const ssm = yield* SsmClientService;
        const { projectId, resourceTagsKeyValue } = yield* CoreConfigurationProviderService;

        const put =
          (input: {
            parameterName: string,
            value: string,
            secured: boolean
          }) =>
            ssm.execute(
              "putParameter",
              {
                Name: `/${projectId}/${input.parameterName}`,
                Value: input.value,
                Type: input.secured ? "SecureString" : "String",
                Tags: resourceTagsKeyValue
              }
            );

        const get =
          (input: {
            parameterName: string,
            decrypt: boolean
          }) =>
            ssm.execute(
              "getParameter",
              {
                Name: input.parameterName,
                WithDecryption: input.decrypt
              }
            ).pipe(
              Effect.andThen(_ => _.Parameter?.Value)
            )

        return { get, put } as const;

      })
  }) { }
