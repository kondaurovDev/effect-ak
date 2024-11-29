import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { SsmClientService } from "#clients/ssm.js";

export class SsmParameterHierarchyService
  extends Effect.Service<SsmParameterHierarchyService>()("SsmParameterHierarchyService", {
    effect:
      Effect.gen(function* () {

        const ssm = yield* SsmClientService;

        const get =
          (input: {
            start: `/${string}`
          }) =>
            pipe(
              ssm.execute(
                `getParametersByPath`,
                {
                  Path: input.start,
                  Recursive: true,
                  WithDecryption: true
                }
              ),
              Effect.andThen(_ => _.Parameters),
              Effect.andThen(parameters => {

                const result = new Map<string, string>();

                parameters?.forEach(parameter => {
                  if (parameter.Name && parameter.Value) {
                    const key = parameter.Name.split("/").slice(2).join("/");
                    result.set(key, parameter.Value);
                  }
                });

                return result;

              })
            );

          return {
            get
          } as const;

      }),
      dependencies: [
        SsmClientService.Default
      ]
  }) {}
