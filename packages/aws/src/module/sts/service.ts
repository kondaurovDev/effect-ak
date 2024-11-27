import { Effect, pipe } from "effect";

import { StsClientService } from "./client.js";

export class StsService
  extends Effect.Service<StsService>()("StsService", {
    effect:
      Effect.gen(function* () {
        
        const sts = yield* StsClientService;

        const accountId =
          yield* pipe(
            sts.execute(
              "getCallerIdentity",
              {}
            ),
            Effect.andThen(_ => _.Account),
            Effect.filterOrDieMessage(_ => _ != null, "AccountId is undefined"),
          );

        return {
          accountId
        } as const;

      }),

      dependencies: [
        StsClientService.Default
      ]
  }) {}
