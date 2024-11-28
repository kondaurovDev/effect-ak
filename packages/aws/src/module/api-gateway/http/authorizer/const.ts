import type { AwsRegionSchema } from "../../../../internal/configuration.js";
import type { LambdaFunctionArn } from "../../../lambda/index.js";
import { api_gateway_arn_beginning } from "../const.js";

export const makeLambdaFunctionAuthorizerArnFrom =
  (input: {
    region: AwsRegionSchema,
    functionArn: LambdaFunctionArn
  }) =>
    [
      `${api_gateway_arn_beginning}${input.region}:lambda:`,
      `path/2015-03-31/functions/${input.functionArn}/invocations`
    ].join();
