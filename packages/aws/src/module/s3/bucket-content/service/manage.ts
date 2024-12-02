import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { S3ClientService } from "#/clients/s3.js";
import { BucketKey, BucketName } from "../types.js";

export class S3BucketContentManageService
  extends Effect.Service<S3BucketContentManageService>()("S3BucketContentManageService", {
    effect:
      Effect.gen(function* () {

        const s3 = yield* S3ClientService;

        const createFileWithContent =
          (input: {
            bucketName: BucketName,
            key: BucketKey,
            content: string | Uint8Array
          }) => {
            const key = [...input.key.path, input.key.objectName].join("/");

            return s3.execute(
              "putObject",
              {
                Bucket: input.bucketName,
                Key: key,
                Body: input.content
              }
            )
          }


        return {
          createFileWithContent,
        } as const

      }),
    dependencies: [
      S3ClientService.Default
    ]
  }) { }
