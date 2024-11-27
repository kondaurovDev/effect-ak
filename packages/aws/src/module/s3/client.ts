import { S3, S3ServiceException } from "@aws-sdk/client-s3"
import * as Effect from "effect/Effect"

import { makeClientWrapper } from "../../internal/client-wrapper.js"
import { awsSdkPackageName } from "../../internal/const.js"

export class S3ClientService extends
  Effect.Service<S3ClientService>()(`${awsSdkPackageName}/S3ClientService`, {
    scoped: makeClientWrapper("S3", _ => new S3(_))
  }) {}
