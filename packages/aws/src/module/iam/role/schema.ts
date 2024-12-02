import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { AwsProjectIdConfig } from "#/core/index.js";

export type IamRoleArn = typeof IamRoleArn.Type
export const IamRoleArn = 
  S.TemplateLiteral(
    "arn:aws:iam::", S.Number, ":role/", S.String, "/", S.String
  );

export type IamRoleName = typeof IamRoleName.Type;
export const IamRoleName =
  S.NonEmptyString.pipe(
    S.pattern(/[\w+=,.@-]+/),
    S.minLength(1),
    S.maxLength(64),
  );

export type IamRoleNamePrefixed = typeof IamRoleNamePrefixed.Type;

const IamRoleNamePrefixed =
  S.TemplateLiteral(
    S.String, "-", S.String
  ).pipe(S.brand("IamRoleNamePrefixed"));

export const makeIamRoleNamePrefixed = 
  (input: string) =>
    Effect.gen(function* () {
      yield* S.validate(IamRoleName)(input);

      const projectId = yield* AwsProjectIdConfig;

      return IamRoleNamePrefixed.make(`${projectId}-${input}`)
    });


