import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { DataFormatJsonService } from "@effect-ak/misc/data-format";
import { NodeTextConversionService } from "@effect-ak/misc/node";

import { S3ClientService, S3MethodInput } from "#/clients/s3.js";
import { BucketName, BucketKey } from "../types.js";

export class S3BucketContentViewService
  extends Effect.Service<S3BucketContentViewService>()("S3BucketContentViewService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          s3: yield* S3ClientService,
          json: yield* DataFormatJsonService,
          text: yield* NodeTextConversionService
        }

        const listObjects = (
          commandInput: S3MethodInput<"listObjectsV2">
        ) =>
          $.s3.execute(
            "listObjectsV2",
            commandInput
          );

        const getFileContent = (
          bucketName: BucketName,
          key: BucketKey
        ) => {

          const fileContent =
            pipe(
              $.s3.execute(
                `getObject`,
                {
                  Bucket: bucketName,
                  Key: key.objectName,
                }
              ),
              Effect.andThen(_ => _.Body),
              Effect.filterOrFail(_ => _ != null),
              Effect.andThen(_ => _.transformToByteArray())
            );

          const file =
            pipe(
              fileContent,
              Effect.andThen(bytes =>
                new global.File([bytes], key.objectName)
              )
            );

          return {
            fileContent,
            file
          } as const;

        }

        const getJsonContent = (
          bucketName: BucketName,
          key: BucketKey
        ) =>
          pipe(
            getFileContent(bucketName, key).fileContent,
            Effect.andThen($.text.uint8ArrayToString),
            Effect.andThen(_ => $.json.decode(_))
          )

        return {
          getFileContent,
          getJsonContent,
          listObjects
        } as const

      }),
    dependencies: [
      S3ClientService.Default,
      DataFormatJsonService.Default
    ]
  }) { }
