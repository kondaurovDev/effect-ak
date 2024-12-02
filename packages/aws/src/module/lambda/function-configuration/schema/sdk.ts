import { Schema as S } from "effect";

export class LambdaFunctionConfigurationEnvironmentSdk
  extends S.Class<LambdaFunctionConfigurationEnvironmentSdk>(
    "LambdaFunctionConfigurationEnvironmentSdk"
  )({
    Variables: S.Record({ key: S.String, value: S.String }).pipe(S.Data, S.optional)
  }) { };

export class LambdaFunctionConfigurationSdk
  extends S.Class<LambdaFunctionConfigurationSdk>(
    "LambdaFunctionConfigurationSdk"
  )({
    Timeout: S.Number.pipe(S.optional),
    MemorySize: S.Number.pipe(S.optional),
    Environment: LambdaFunctionConfigurationEnvironmentSdk.pipe(S.optional),
    Handler: S.String.pipe(S.optional),
    CodeSize: S.Number.pipe(S.optional)
  }) { }

export const LambdaFunctionConfigurationRuntimeSdk =
  S.Literal("nodejs22.x", "nodejs20.x");
