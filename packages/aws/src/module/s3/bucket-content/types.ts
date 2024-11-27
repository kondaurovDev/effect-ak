import { pipe } from "effect/Function";
import * as Brand from "effect/Brand";
import * as S from "effect/Schema";

// https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
export type BucketName = typeof BucketName.Type;
export const BucketName = S.NonEmptyString;

// https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html#bucketnamingrules-directorybucket
export type BucketKeyPart = typeof BucketKeyPart.Type;
export const BucketKeyPart = 
  pipe(
    S.String,
    S.pattern(/[0-9a-zA-Z-_]/),
  );

export type BucketKey = typeof BucketKey.Type;
export const BucketKey = 
  S.Struct({
    path: S.Array(BucketKeyPart),
    objectName: S.NonEmptyString
  });

export class BucketObjectContent 
  extends S.Class<BucketObjectContent>("BucketObjectContent")(
    S.Struct({
      path: S.Array(BucketKeyPart),
      objectName: S.NonEmptyString
    })
  ) {};

export type ObjectVersion = string & Brand.Brand<"ObjectVersion">;
export const ObjectVersion = Brand.nominal<ObjectVersion>();
