import type { AwsRegion } from "#core/index.js";
import type { LambdaFunctionArn } from "#module/lambda/index.js";
import { api_gateway_arn_beginning } from "../brands.js";

export const makeLambdaFunctionAuthorizerArnFrom =
  (input: {
    region: AwsRegion,
    functionArn: LambdaFunctionArn
  }) =>
    [
      `${api_gateway_arn_beginning}${input.region}:lambda:`,
      `path/2015-03-31/functions/${input.functionArn}/invocations`
    ].join();
