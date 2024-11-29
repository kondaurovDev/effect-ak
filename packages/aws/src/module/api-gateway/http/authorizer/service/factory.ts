import * as Effect from "effect/Effect";

import type { LambdaFunctionArn } from "../../../../lambda/index.js";
import { AwsRegionConfig } from "../../../../../core/index.js";
import { makeLambdaFunctionAuthorizerArnFrom } from "../const.js";

export class ApiGatewayHttpAuthorizerFactoryService
  extends Effect.Service<ApiGatewayHttpAuthorizerFactoryService>()("ApiGatewayHttpAuthorizerFactoryService", {
    effect:
      Effect.gen(function* () {

        const region = yield* AwsRegionConfig;

        const makeLambdaFunctionAuthorizerArn =
          (input: {
            functionArn: LambdaFunctionArn
          }) =>
            makeLambdaFunctionAuthorizerArnFrom({
              functionArn: input.functionArn, region
            });

        return {
          makeLambdaFunctionAuthorizerArn
        }

      })
  }) { }