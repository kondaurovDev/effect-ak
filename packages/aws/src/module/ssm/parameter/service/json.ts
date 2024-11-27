import { pipe } from "effect/Function";
import * as S from "effect/Schema";
import * as Effect from "effect/Effect";
import { DataFormatJsonService } from "@effect-ak/misc/data-format";

import { SsmClientService } from "../../client.js";

export class SsmParameterJsonService
  extends Effect.Service<SsmParameterJsonService>()("SsmParameterJsonService", {
    effect:
      Effect.gen(function* () {

        const ssm = yield* SsmClientService;
        const jsonFormat = yield* DataFormatJsonService

        const get =
          (input: {
            parameterName: string
          }) =>
            pipe(
              ssm.execute(
                "getting json parameter",
                _ => _.getParameter({
                  Name: input.parameterName,
                  WithDecryption: true
                })
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
                  "putting json parameter",
                  _ => _.putParameter({
                    Name: input.parameterName,
                    Value: encoded,
                    Type: input.secured ? "SecureString" : "String"
                  })
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
