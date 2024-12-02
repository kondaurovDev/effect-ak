import { Schema as S } from "effect";

import { LambdaFunctionEventSource } from "#/module/lambda/event-source/schema/event-source.js";
import { LambdaFunctionConfigurationRuntimeSdk } from "#/module/lambda/function-configuration/schema/sdk.js";
import { LambdaFunctionConfigurationSyncCommand } from "#/module/lambda/function-configuration/schema/commands.js";
import { LambdaFunctionSourceCode } from "./source-code.js";
import { LambdaFunctionMetadata } from "./metadata.js";

export class LambdaFunctionUpsertCommand
  extends S.Class<LambdaFunctionUpsertCommand>(
    "LambdaFunctionUpsertCommand"
  )({
    functionName: LambdaFunctionMetadata.fields.name,
    code: LambdaFunctionSourceCode,
    description: S.NonEmptyString,
    configuration: LambdaFunctionConfigurationSyncCommand.pipe(S.omit("functionName")),
    roleName: S.NonEmptyString,
    runtime: LambdaFunctionConfigurationRuntimeSdk,
    eventSource: LambdaFunctionEventSource.pipe(S.optional),
  }) { };
