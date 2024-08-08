import { Effect, pipe } from "effect";

import * as T from "./types.js";
import { Service } from "./service.js"
import { tryAwsServiceMethod } from "../error.js";

export const listFiles = (
  bucketName: T.BucketName,
  key?: T.BucketKey,
  delimiter?: string
) =>
  pipe(
    Service,
    Effect.andThen(s3SDK =>
      tryAwsServiceMethod(
        "list object",
        () =>
          s3SDK.listObjectsV2({
            Bucket: bucketName,
            ...(delimiter && {
              Delimiter: delimiter
            }),
            ...(key && {
              Prefix: key
            })
          })
      )
    )
  );
