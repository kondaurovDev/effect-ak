import { pipe } from "effect/Function";
import * as S from "effect/Schema";

import { } from "#/core/const.js"

import { projectIdRegex, regionRegex } from "./const.js";

export type AwsRegion = typeof AwsRegion.Type;
export const AwsRegion =
  pipe(
    S.TemplateLiteral(S.String, "-", S.String, "-", S.Number),
    S.pattern(regionRegex),
    S.brand("AwsRegion")
  );

export type AwsProjectId = typeof AwsProjectId.Type;
export const AwsProjectId =
  pipe(
    S.NonEmptyString,
    S.pattern(projectIdRegex),
    S.brand("AwsProjectId")
  );

export type AwsAccountId = typeof AwsAccountId.Type;
export const AwsAccountId =
  pipe(
    S.Number,
    S.brand("AwsAccountId")
  );
