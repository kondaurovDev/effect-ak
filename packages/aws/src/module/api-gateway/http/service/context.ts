import * as Effect from "effect/Effect";

import { GlobalContextTag, ApiGatewayType } from "../../../../public/index.js";

export class ApiGatewayHttpFactoryService
  extends Effect.Service<ApiGatewayHttpFactoryService>()("ApiGatewayHttpFactoryService", {
    effect:
      Effect.gen(function* () {

        const ctx = yield* GlobalContextTag;

        const resourceTags =
          (input: {
            gatewayType: ApiGatewayType
          }) => [
            ...ctx.resourceTags,
            `api-gateway-type:${input.gatewayType}`
          ] as const;

        const getExecuteApiArn =
          (apiId: string) =>
            `arn:aws:execute-api:${ctx.region}:${ctx.accountId}:${apiId}/*/*/*`

        const getApiGatewayUrl =
          (apiId: string) =>
            `https://${apiId}.execute-api.${ctx.region}.amazonaws.com`

        const getApiGatewayArn = (
          apiId: string
        ) =>
          `arn:aws:apigateway:${ctx.region}::/apis/${apiId}`

        return {
          ctx, getExecuteApiArn, getApiGatewayUrl, getApiGatewayArn, resourceTags
        } as const;

      })
  }) { }
