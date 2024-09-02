import { Effect, pipe } from "effect";
import { parseJson } from "@efkit/shared";

import * as T from "./types.js";
import { Service } from "./service.js"
import { tryAwsServiceMethod } from "../error.js";
import { S3 } from "@efkit/aws";

export const createFileWithContent = (
  bucketName: T.BucketName,
  key: T.BucketKey,
  content: T.FileContent
) =>
  pipe(
    Service,
    Effect.andThen(s3Sdk =>
      tryAwsServiceMethod(
        `put object to ${bucketName}:${key}`,
        () =>
          s3Sdk.putObject({
            Bucket: bucketName,
            Key: key,
            Body: content
          })
      )
    ),
    Effect.provide(S3.ServiceLive)
  )

export const getFileContent = (
  bucketName: T.BucketName,
  key: T.BucketKey
) =>
  Effect.Do.pipe(
    Effect.bind("fileName", () =>
      Effect.fromNullable(key.split("/").at(-1))
    ),
    Effect.bind("s3SDK", () => Service),
    Effect.bind("fileContent", ({ s3SDK }) =>
      tryAwsServiceMethod(
        `get file content ${bucketName}:${key}`,
        () =>
          s3SDK.getObject({
            Bucket: bucketName,
            Key: key
          })
      ).pipe(
        Effect.andThen(result =>
          Effect.fromNullable(result.Body),
        ),
        Effect.andThen(_ => ({
          bytes: 
            Effect.tryPromise(() => _.transformToByteArray()),
          string: 
            Effect.tryPromise(() => _.transformToString()),
          stream:
            Effect.suspend(() => Effect.succeed(_.transformToWebStream()))
        }))
      )
    ),
    Effect.let("file", ({ fileContent, fileName }) =>
      fileContent.bytes.pipe(
        Effect.andThen(bytes =>
          new global.File([ bytes], fileName)
        )
      )
    ),
    Effect.provide(S3.ServiceLive)
  )

export const getJsonContent = (
  bucketName: T.BucketName,
  key: T.BucketKey
) =>
  pipe(
    getFileContent(bucketName, key),
    Effect.andThen(_ => _.fileContent.string),
    Effect.andThen(parseJson)
  )
