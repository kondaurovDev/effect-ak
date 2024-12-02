import { pipe, Schema as S } from "effect";

const iam_role_arn_begginning = "arn:aws:iam::";

export type IamRoleName = typeof IamRoleMetadata.fields.name.Type;
export type IamRoleArn = typeof IamRoleMetadata.fields.arn.Type;

export class IamRoleMetadata
  extends S.Class<IamRoleMetadata>(
    "IamRoleMetadata"
  )({
    name:
      pipe(
        S.NonEmptyString,
        S.pattern(/[\w+=,.@-]+/),
        S.minLength(1),
        S.maxLength(64),
      ),
    arn:
      S.TemplateLiteral(
        iam_role_arn_begginning, S.Number, ":role/", S.String
      ),
  }) { }

export const makeIamRoleArnFrom = 
  (input: {
    accountId: number,
    name: string
  }): IamRoleArn =>
    `${iam_role_arn_begginning}${input.accountId}:role/${input.name}`
