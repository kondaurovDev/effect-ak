import { pipe } from "effect/Function";
import * as C from "effect/Config";
import * as S from "effect/Schema";

import { awsSdkModuleName, projectIdRegex, regionRegex } from "./const.js";
import { AwsProjectId, AwsRegion } from "./brands.js";

export const AwsRegionConfig =
  pipe(
    C.nonEmptyString("region"),
    C.validate({
      message: `Invalid AWS region. Valid format: ${regionRegex}`,
      validation: S.is(AwsRegion)
    }),
    C.nested(awsSdkModuleName),
    C.withDefault(AwsRegion.make("eu-west-3"))
  );

export const AwsProjectIdConfig =
  pipe(
    C.nonEmptyString("project-id"),
    C.validate({
      message: `Invalid AWS project id. Valid format: ${projectIdRegex}`,
      validation: S.is(AwsProjectId)
    }),
    C.nested(awsSdkModuleName)
  );
