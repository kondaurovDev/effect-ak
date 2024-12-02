import { Schema as S } from "effect";

import { LambdaFunctionMetadata } from "#/module/lambda/function/schema/metadata.js";
import { LambdaFunctionConfigurationEnvironmentSdk } from "./sdk.js";

export class LambdaFunctionConfigurationSyncCommand 
  extends S.Class<LambdaFunctionConfigurationSyncCommand>("LambdaFunctionConfigurationSyncCommand")(
    S.Struct({
      functionName: LambdaFunctionMetadata.fields.name,
      timeout: S.Number.pipe(S.optional),
      memorySize: S.Number.pipe(S.optional),
      environment: LambdaFunctionConfigurationEnvironmentSdk.fields.Variables,
      handler: S.String.pipe(S.optional),
    })
  ) {}
