import * as B from "effect/Brand";

import { AwsRegionTemplate } from "../../../core/domain/index.js";

export const lambda_function_arn_beginning = "arn:aws:lambda:";

export type LambdaFunctionArn =
  (
    `${typeof lambda_function_arn_beginning}${AwsRegionTemplate}:${number}:function:${string}`
  ) & B.Brand<LambdaFunctionArn>;

export const LambdaFunctionArn = 
  S.TemplateLiteral(
    lambda_function_arn_beginning, S.String, ":", S.Number, ":function:", S.String
  );