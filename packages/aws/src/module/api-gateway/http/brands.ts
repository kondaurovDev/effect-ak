import * as Brand from "effect/Brand"

import type { AwsRegion } from "#/core/index.js"
import { amazon_com } from "#/module/const.js"

export const api_gateway_arn_beginning = "arn:aws:apigateway";

export type ApiGatewayHttpArn =
  (
    `${typeof api_gateway_arn_beginning}:${AwsRegion}::/apis/${string}`
  ) & Brand.Brand<"ApiGatewayHttpArn">
export const ApiGatewayHttpArn = Brand.nominal<ApiGatewayHttpArn>();

export const makeApiGatewayArnFrom =
  (input: {
    apiId: string,
    region: AwsRegion
  }) =>
    ApiGatewayHttpArn(`${api_gateway_arn_beginning}:${input.region}::/apis/${input.apiId}`)

export const makeApiGatewayUrlFrom =
  (input: {
    apiId: string,
    region: AwsRegion
  }) =>
    `https://${input.apiId}.execute-api.${input.region}.${amazon_com}`

export const makeExecuteApiArnFrom =
  (input: {
    apiId: string,
    region: AwsRegion,
    accountId: number
  }) =>
    `arn:aws:execute-api:${input.region}:${input.accountId}:${input.apiId}/*/*/*`
