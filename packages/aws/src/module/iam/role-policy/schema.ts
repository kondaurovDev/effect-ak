import * as S from "effect/Schema";

import { awsServicesList } from "#/module/const.js";

export type IamRolePolicyName = typeof IamRolePolicyName.Type
export const IamRolePolicyName =
  S.NonEmptyString.pipe(
    S.minLength(1),
    S.maxLength(128),
    S.pattern(/[\w+=,.@-]+/)
  );

export type IamRolePolicyDocumentAction =
  typeof IamRolePolicyDocumentAction.Type

export const IamRolePolicyDocumentAction =
  S.Union(
    S.TemplateLiteral(S.String, ":", S.String),
    S.TemplateLiteral(S.String, ":", S.String).pipe(S.Array, S.Data)
  );

export type IamRolePolicyDocumentResource = typeof IamRolePolicyDocumentResource.Type
export const IamRolePolicyDocumentResource =
  S.Union(
    S.NonEmptyString,
    S.NonEmptyString.pipe(S.Array, S.Data)
  );

export class IamRolePolicyDocumentPrincipal 
  extends S.Class<IamRolePolicyDocumentPrincipal>("IamRolePolicyDocumentPrincipal")(
    S.Struct({
      Service:
      S.TemplateLiteral(
        S.Literal(...awsServicesList),
        S.Literal(".amazonaws.com")
      )
    })
  ) {}

export class IamRolePolicyDocumentStatement
  extends S.Class<IamRolePolicyDocumentStatement>("IamRolePolicyDocumentStatement")(
    S.Struct({
      Effect: S.Literal("Allow", "Deny"),
      Action: IamRolePolicyDocumentAction,
      Resource:
        IamRolePolicyDocumentResource.pipe(S.optional),
      Principal:
        IamRolePolicyDocumentPrincipal.pipe(S.optional)
    })
  ) { }

export class IamRolePolicyDocument
  extends S.Class<IamRolePolicyDocument>("IamRolePolicyDocument")(
    S.Struct({
      Version: S.Literal("2012-10-17"),
      Statement: S.Data(S.Array(IamRolePolicyDocumentStatement))
    })
  ) {

  static fromJsonString(input: string) {
    return S.decode(S.parseJson(IamRolePolicyDocument))(decodeURIComponent(input))
  }

  static toJsonString(input: IamRolePolicyDocument) {
    return S.encode(S.parseJson(IamRolePolicyDocument))(input)
  }

}
