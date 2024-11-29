import { pipe } from "effect/Function";
import * as Brand from "effect/Brand";
import * as S from "effect/Schema";
import type * as Sdk from "@aws-sdk/client-apigatewayv2";

import { IntegrationDescription } from "../integration/schema/types.js";
import { AuthorizerName } from "../authorizer/types.js";

export type SdkHttpRoute = Sdk.Route & Brand.Brand<"HttpRoute">;
export const SdkHttpRoute = Brand.nominal<SdkHttpRoute>();

export type HttpRoute =
  typeof HttpRoute.Type

export const HttpRoute = 
  S.Struct({
    path: S.suspend(() => RoutePath),
    integrationName: IntegrationDescription,
    authorizerName: S.optional(AuthorizerName)
  })

const RouteMethod = S.Literal("POST", "ANY", "GET", "PUT");

export type RoutePath = typeof RoutePath.Type
export const RoutePath = 
  pipe(
    S.TemplateLiteral(RouteMethod, " /", S.String),
    S.brand("RoutePath")
  ).annotations({ 
    identifier: "RoutePath" 
  });
