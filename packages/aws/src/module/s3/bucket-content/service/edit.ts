import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { S3ClientService } from "../../client.js";
import { BucketKey, BucketName } from "../types.js";

export class S3BucketContentEditService
  extends Effect.Service<S3BucketContentEditService>()("S3BucketContentEditService", {
    effect:
      Effect.gen(function* () {

        const s3 = yield* S3ClientService;

        const createFileWithContent = (
          bucketName: BucketName,
          key: BucketKey,
          content: string | Uint8Array
        ) =>
          pipe(
            s3.execute(
              "putObject",
              {
                Bucket: bucketName,
                Key: [...key.path, key.objectName].join("/"),
                Body: content
              }
            )
          );

        return {
          createFileWithContent,
        } as const

      }),
      dependencies: [
        S3ClientService.Default
      ]
  }) { }
