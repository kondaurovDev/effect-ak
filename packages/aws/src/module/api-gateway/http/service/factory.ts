import * as Effect from "effect/Effect";

import { AwsProjectIdConfig, AwsRegionConfig } from "../../../../internal/configuration.js";
import * as C from "../const.js";
import { StsService } from "../../../sts/service.js";

export class ApiGatewayHttpFactoryService
  extends Effect.Service<ApiGatewayHttpFactoryService>()("ApiGatewayHttpFactoryService", {
    effect:
      Effect.gen(function* () {

        const region = yield* AwsRegionConfig;
        const config = yield* AwsProjectIdConfig;
        const { accountId } = yield* StsService;

        const resourceTags = [
          ...config.resourceTags,
          `api-gateway-type:https`
        ] as const;

        const resourceTagsMap = {
          ...config.resourceTagsMap,
          [ "api-gateway-type" ]: "https"
        }

        const makeResourceTags = () => resourceTags;
        const makeResourceTagsMap = () => resourceTagsMap;

        const makeExecuteApiArn =
          (apiId: string) =>
            C.makeExecuteApiArnFrom({ accountId, apiId, region })

        const makeApiGatewayUrl =
          (apiId: string) =>
            C.makeApiGatewayUrlFrom({ apiId, region })

        const getApiGatewayArn = (
          apiId: string
        ) =>
          `arn:aws:apigateway:${region}::/apis/${apiId}`

        return {
          makeResourceTagsMap, makeResourceTags, makeExecuteApiArn, 
          makeApiGatewayUrl, getApiGatewayArn
        } as const;

      })
  }) { }
