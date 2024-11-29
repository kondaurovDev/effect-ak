import { pipe } from "effect/Function";
import * as S from "effect/Schema";
import * as Effect from "effect/Effect";
import { DataFormatJsonService } from "@effect-ak/misc/data-format";

import { SsmClientService } from "#clients/ssm.js";
import { CoreConfigurationProviderService } from "#core/service/configuration-provider.js";

export class SsmParameterJsonService
  extends Effect.Service<SsmParameterJsonService>()("SsmParameterJsonService", {
    effect:
      Effect.gen(function* () {

        const ssm = yield* SsmClientService;
        const jsonFormat = yield* DataFormatJsonService
        const { projectId, resourceTagsKeyValue } = yield* CoreConfigurationProviderService;

        const get =
          (input: {
            parameterName: string
          }) =>
            pipe(
              ssm.execute(
                "getParameter",
                {
                  Name: input.parameterName,
                  WithDecryption: true,
                }
              ),
              Effect.andThen(_ => _?.Parameter?.Value),
              Effect.andThen(value =>
                value == null ?
                  Effect.succeed(undefined) :
                  S.validate(
                    S.parseJson(S.Record({ key: S.String, value: S.Unknown }))
                  )
              )
            )

        const put =
          (input: {
            parameterName: string,
            value: unknown,
            secured: boolean
          }) => 
            pipe(
              jsonFormat.encode(input.value),
              Effect.andThen(encoded =>
                ssm.execute(
                  "putParameter",
                  {
                    Name: `/${projectId}/${input.parameterName}`,
                    Value: encoded,
                    Type: input.secured ? "SecureString" : "String",
                    Tags: resourceTagsKeyValue
                  }
                )
              )
            );

        return { get, put } as const;

      }),

      dependencies: [
        DataFormatJsonService.Default,
        SsmClientService.Default
      ]
  }) { }
