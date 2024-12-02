import * as S from "effect/Schema";

import type { AwsRegion } from "#/core/index.js";
import * as C from "#/module/lambda/const.js";

export type LambdaFunctionName = typeof LambdaFunctionMetadata.fields.name.Type;
export type LambdaFunctionArn = typeof LambdaFunctionMetadata.fields.arn.Type;

export class LambdaFunctionMetadata
  extends S.Class<LambdaFunctionMetadata>("LambdaFunctionMetadata")({
    name: S.NonEmptyString.pipe(S.pattern(/^[a-zA-Z0-9-_]{3,50}$/)),
    arn:
      S.TemplateLiteral(
        C.lambda_function_arn_beginning, S.String, ":", S.Number, ":function:", S.String
      ),
  }) { }

export const makeFunctionArnFrom =
  (input: {
    region: AwsRegion,
    accountId: number,
    functionName: LambdaFunctionName
  }): LambdaFunctionArn =>
    `${C.lambda_function_arn_beginning}${input.region}:${input.accountId}:function:${input.functionName}`
