import * as Brand from "effect/Brand";
import type * as Sdk from "@aws-sdk/client-apigatewayv2";
import * as S from "effect/Schema";

export type SdkAuthorizer = Sdk.Authorizer & Brand.Brand<"Authorizer">;
export const SdkAuthorizer = Brand.nominal<SdkAuthorizer>();

export type AuthorizerName = typeof AuthorizerName.Type;
export const AuthorizerName = S.NonEmptyString.pipe(S.brand("AuthorizerName"));

export type AuthorizerType = Brand.Branded<Sdk.AuthorizerType, "AuthorizerType">;
export const AuthorizerType = Brand.nominal<AuthorizerType>();

export type AuthorizerId = typeof AuthorizerId.Type
export const AuthorizerId = S.NonEmptyString.pipe(S.brand("AuthorizerId"))

export type AuthorizerIdentitySources = string[] & Brand.Brand<"AuthorizerIdentitySources">;
export const AuthorizerIdentitySources = Brand.nominal<AuthorizerIdentitySources>();

export type CreateOrUpdateAuthorizer = 
  Required<Pick<
    Sdk.UpdateAuthorizerCommandInput, 
    "Name" | "AuthorizerType" | "IdentitySource" | "ApiId" | "AuthorizerPayloadFormatVersion" |
    "EnableSimpleResponses" | "AuthorizerResultTtlInSeconds" | "AuthorizerUri"
  >> & Brand.Brand<"CreateOrUpdateAuthorizer">;

export const CreateOrUpdateAuthorizer = Brand.nominal<CreateOrUpdateAuthorizer>();

export class LambdaAuthorizer
  extends S.Class<LambdaAuthorizer>("LambdaAuthorizer")({
    id: S.NonEmptyString.annotations({ title: "unique id" }),
    functionName: S.String,
    cacheTtlSec: S.Positive,
    identitySources:
      S.NonEmptyArray(S.NonEmptyString).annotations({
        title: "Identity sources",
        description: "Headers with credentials"
      }),
  }) { }
