import * as Effect from "effect/Effect";

import { GlobalContextTag } from "../../../../internal/global-context.js";
import { SsmClientService } from "../../client.js";

export class SsmParameterPlainService
  extends Effect.Service<SsmParameterPlainService>()("SsmParameterPlainService", {
    effect:
      Effect.gen(function* () {

        const ssm = yield* SsmClientService;
        const ctx = yield* GlobalContextTag;

        const put =
          (input: {
            parameterName: string,
            value: string,
            secured: boolean
          }) =>
            ssm.execute(
              "put parameter",
              _ => _.putParameter({
                Name: `/${ctx.projectId}/${input.parameterName}`,
                Value: input.value,
                Type: input.secured ? "SecureString" : "String"
              })
            );

        const get =
          (input: {
            parameterName: string,
            decrypt: boolean
          }) =>
            ssm.execute(
              "get parameter",
              _ => _.getParameter({
                Name: input.parameterName,
                WithDecryption: input.decrypt
              })
            ).pipe(
              Effect.andThen(_ => _.Parameter?.Value)
            )

        return { get, put } as const;

      })
  }) { }
