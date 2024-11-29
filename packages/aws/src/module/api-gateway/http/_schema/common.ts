import * as S from "effect/Schema";

import { api_gateway_arn_beginning } from "../brands.js";

export type ApiGatewayArn = typeof ApiGatewayArn.Type
export const ApiGatewayArn = 
  S.TemplateLiteral(
    api_gateway_arn_beginning, S.String, "::/apis/", S.String
  );
