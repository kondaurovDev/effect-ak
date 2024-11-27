import type * as Sdk from "@aws-sdk/client-s3";
import * as Effect from "effect/Effect";

import { S3ClientService } from "../../client.js";

export class S3BucketContentObjectService
  extends Effect.Service<S3BucketContentObjectService>()("S3BucketContentObjectService", {
    effect:
      Effect.gen(function* () {

        const s3 = yield* S3ClientService;

        const listObjects = (
          commandInput: Sdk.ListObjectsV2CommandInput
        ) =>
          s3.execute(
            "list objects of s3 bucket",
            _ => _.listObjectsV2(commandInput)
          );

        return {
          listObjects
        } as const;

      }),

      dependencies: [
        S3ClientService.Default
      ]
  }) { }
