import { Effect } from "effect"
import {
  ApiGatewayV2
} from "@aws-sdk/client-apigatewayv2";

import { makeClientWrapper } from "../../internal/client-wrapper.js"
import { awsSdkPackageName } from "../../internal/const.js";

export class ApiGatewayClientService extends
  Effect.Service<ApiGatewayClientService>()(`${awsSdkPackageName}/ApiGatewayClientService`, {
    scoped: makeClientWrapper("ApiGateway", _ => new ApiGatewayV2(_))
  }) { }
