import * as Effect from "effect/Effect";

import { S3ClientService, S3MethodInput } from "../../client.js";

export class S3BucketContentObjectService
  extends Effect.Service<S3BucketContentObjectService>()("S3BucketContentObjectService", {
    effect:
      Effect.gen(function* () {

        const s3 = yield* S3ClientService;

        const listObjects = (
          commandInput: S3MethodInput<"listObjectsV2">
        ) =>
          s3.execute(
            "listObjectsV2",
            commandInput
          );

        return {
          listObjects
        } as const;

      }),

      dependencies: [
        S3ClientService.Default
      ]
  }) { }
