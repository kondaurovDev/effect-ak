import * as Effect from "effect/Effect";

import { Apigatewayv2ClientService } from "../../../client.js";
import type { LambdaFunctionArn } from "../../../../lambda/index.js";
import { AwsRegionConfig } from "../../../../../internal/configuration.js";

export class ApiGatewayHttpAuthorizerFactoryService
  extends Effect.Service<ApiGatewayHttpAuthorizerFactoryService>()("ApiGatewayHttpAuthorizerFactoryService", {
    effect:
      Effect.gen(function* () {

        const client = yield* Apigatewayv2ClientService;

        const region = yield* AwsRegionConfig;

        const makeLambdaFunctionAuthorizerArn = 
          (input: {
            functionArn: LambdaFunctionArn
          }) =>
          [
            `arn:aws:apigateway:${region}:lambda:`,
            `path/2015-03-31/functions/${input.functionArn}/invocations`
          ].join();

        return {
          makeLambdaFunctionAuthorizerArn
        }

      })
  }) { }