import { SSM } from "@aws-sdk/client-ssm"
import * as Effect from "effect/Effect"

import { makeClientWrapper } from "../../internal/client-wrapper.js"
import { awsSdkPackageName } from "../../internal/const.js"

export class SsmClientService extends
  Effect.Service<SsmClientService>()(`${awsSdkPackageName}/SsmClientService`, {
    scoped: makeClientWrapper("SSM", _ => new SSM(_), )
  }) {}

