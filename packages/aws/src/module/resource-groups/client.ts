import * as Effect from "effect/Effect"
import {
  ResourceGroupsTaggingAPI
} from "@aws-sdk/client-resource-groups-tagging-api";

import { makeClientWrapper } from "../../internal/client-wrapper.js"
import { awsSdkPackageName } from "../../internal/const.js";

export class ResourceGroupsTaggingApiClientService extends
  Effect.Service<ResourceGroupsTaggingApiClientService>()(`${awsSdkPackageName}/ResourceGroupsTaggingApiClientService`, {
    scoped:
      makeClientWrapper(
        "ResourceGroupsTaggingApi",
        _ => new ResourceGroupsTaggingAPI(_),
      )
  }) { }
