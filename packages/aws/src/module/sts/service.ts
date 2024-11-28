import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";

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
            Effect.andThen(_ => S.decodeUnknown(S.NumberFromString)(_.Account))
          );

        return {
          accountId
        } as const;

      }),

      dependencies: [
        StsClientService.Default
      ]
  }) {}
