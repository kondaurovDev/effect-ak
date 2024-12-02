import { Schema as S } from "effect";

import { EventSource } from "#/module/lambda/event-source/service/_export.js";
import { LambdaFunctionConfigurationSyncCommand, LambdaFunctionConfigurationRuntimeSdk } from "#/module/lambda/function-configuration/schema/_export.js";
import { LambdaFunctionSourceCode } from "./source-code.js";
import { LambdaFunctionMetadata } from "./metadata.js";
import { IamRoleArn } from "#/module/iam/index.js";

export class LambdaFunctionUpsertCommand
  extends S.Class<LambdaFunctionUpsertCommand>(
    "LambdaFunctionUpsertCommand"
  )({
    functionName: LambdaFunctionMetadata.fields.name,
    code: LambdaFunctionSourceCode,
    description: S.NonEmptyString,
    configuration: LambdaFunctionConfigurationSyncCommand.pipe(S.omit("functionName")),
    iamRole: IamRoleArn,
    runtime: LambdaFunctionConfigurationRuntimeSdk,
    eventSource: EventSource.pipe(S.optional),
  }) { };
