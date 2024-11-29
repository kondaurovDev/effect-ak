import * as S from "effect/Schema";

import { EventSource } from "../event-source/types.js";
import { lambda_function_arn_beginning } from "./const.js";

export type LambdaFunctionArn = typeof LambdaFunctionArn.Type
export const LambdaFunctionArn = 
  S.TemplateLiteral(
    lambda_function_arn_beginning, S.String, ":", S.Number, ":function:", S.String
  );

export type LambdaFunctionSourceCode =
  typeof LambdaFunctionSourceCode.Type

export const LambdaFunctionSourceCode =
  S.Union(
    S.Struct({
      type: S.Literal("inline"),
      code: S.NonEmptyString
    }),
    S.Struct({
      type: S.Literal("file"),
      path: S.NonEmptyString.pipe(S.NonEmptyArray),
      external: S.NonEmptyString.pipe(S.Array, S.optional),
      minify: S.Boolean.pipe(S.optional)
    })
  );

export type LambdaFunctionName = typeof LambdaFunctionName.Type;
export const LambdaFunctionName =
  S.NonEmptyString.pipe(
    S.pattern(/^[a-zA-Z0-9-_]{3,50}$/)
  );

export class LambdaFunction
  extends S.Class<LambdaFunction>("LambdaFunction")(
    S.Struct({
      functionName: LambdaFunctionName,
      sourceCode: LambdaFunctionSourceCode,
      description: S.NonEmptyString,
      eventSource: EventSource.pipe(S.optional),
      memory: S.Number,
      timeout: S.Number.pipe(S.greaterThanOrEqualTo(15), S.lessThanOrEqualTo(15 * 60)),
      env: S.Record({ key: S.NonEmptyString, value: S.NonEmptyString }).pipe(S.Data, S.optional)
    })
  ) { }
