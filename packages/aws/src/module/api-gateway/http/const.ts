import type { AwsRegionSchema } from "../../../internal/configuration.js"
import { amazon_com } from "../../const.js"

export const api_gateway_arn_beginning = "arn:aws:apigateway:";

export const makeApiGatewayArn =
  (input: {
    apiId: string,
    region: AwsRegionSchema
  }) =>
    `${api_gateway_arn_beginning}${input.region}::/apis/${input.apiId}`

export const makeApiGatewayUrlFrom =
  (input: {
    apiId: string,
    region: AwsRegionSchema
  }) =>
    `https://${input.apiId}.execute-api.${input.region}.${amazon_com}`

export const makeExecuteApiArnFrom =
  (input: {
    apiId: string,
    region: AwsRegionSchema,
    accountId: number
  }) =>
    `arn:aws:execute-api:${input.region}:${input.accountId}:${input.apiId}/*/*/*`
