import * as Effect from "effect/Effect";

import {
  CloudWatch, CloudWatchServiceException, 
} from "@aws-sdk/client-cloudwatch"
import { awsSdkPackageName } from "../../internal/const.js";
import { makeClientWrapper } from "../../internal/client-wrapper.js";

export class CloudwatchClient extends
  Effect.Service<CloudwatchClient>()(`${awsSdkPackageName}/CloudwatchClient`, {
    effect:
    makeClientWrapper("Cloudwatch", _ => new CloudWatch(_), CloudWatchServiceException)
  }) { }
