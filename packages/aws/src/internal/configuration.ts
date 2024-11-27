import { pipe } from "effect/Function";
import * as Config from "effect/Config";
import * as Data from "effect/Data";
import * as S from "effect/Schema";

import { awsSdkModuleName, awsSdkPackageName } from "./const.js";

export const AwsRegionSchema =
  S.TemplateLiteral(S.String, "-", S.String, "-", S.Number);

export const AwsRegionConfig =
  Config.nonEmptyString("region").pipe(
    Config.validate({
      message: "Invalid AWS region",
      validation: S.is(AwsRegionSchema)
    }),
    Config.nested(awsSdkModuleName),
    Config.withDefault("eu-west-3")
  );

const AwsProjectIdSchema =
  S.NonEmptyString.pipe(
    S.pattern(/^[a-zA-Z0-9-_]{3,20}$/)
  );

export class AwsProjectId 
  extends Data.TaggedClass("AwsProjectId")<{
    projectId: typeof AwsProjectIdSchema.Type
  }> {

    readonly projectIdKeyName = `${awsSdkPackageName}/projectId`;

    readonly resourceTags = [
      `${this.projectIdKeyName}:${this.projectId}`
    ] as const;
  
    readonly resourceTagsMap = {
      [`${this.projectIdKeyName}`]: this.projectId
    } as const;

  };

export const AwsProjectIdConfig =
  pipe(
    Config.nonEmptyString("project-id"),
    Config.validate({
      message: "Invalid AWS project id",
      validation: S.is(AwsProjectIdSchema)
    }),
    Config.map(projectId => new AwsProjectId({ projectId })),
    Config.nested(awsSdkModuleName),
  );
