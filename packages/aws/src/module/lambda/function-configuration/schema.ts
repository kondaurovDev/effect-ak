import * as S from "effect/Schema";

export class LambdaFunctionConfigurationEnvironment
  extends S.Class<LambdaFunctionConfigurationEnvironment>("LambdaFunctionConfigurationEnvironment")(
    S.Struct({
      Variables: S.Record({ key: S.String, value: S.String }).pipe(S.Data)
    })
  ) {}

export class LambdaFunctionConfiguration
  extends S.Class<LambdaFunctionConfiguration>("LambdaFunctionConfiguration")(
    S.Struct({
      Timeout: S.Number,
      MemorySize: S.Number,
      Environment: LambdaFunctionConfigurationEnvironment,
      Handler: S.String
    })
  ) {}
