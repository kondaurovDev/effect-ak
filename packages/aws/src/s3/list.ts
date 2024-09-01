import { Effect, pipe } from "effect";

import * as T from "./types.js";
import { Service, ServiceLive } from "./service.js"
import { tryAwsServiceMethod } from "../error.js";

export const listFiles = (
  bucketName: T.BucketName,
  key?: T.BucketKey,
  delimiter?: string
) =>
  pipe(
    Service,
    Effect.andThen(s3Sdk =>
      tryAwsServiceMethod(
        "list object",
        () =>
          s3Sdk.listObjectsV2({
            Bucket: bucketName,
            ...(delimiter && {
              Delimiter: delimiter
            }),
            ...(key && {
              Prefix: key
            })
          })
      )
    ),
    Effect.provide(ServiceLive)
  );
