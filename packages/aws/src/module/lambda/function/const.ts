import * as Config from "effect/Config";

export type LambdaFunctionEnvironmentVariable = 
  typeof lambdaFunctionEnvironmentVariables[number];
export const lambdaFunctionEnvironmentVariables = [
  "AWS_DEFAULT_REGION", "AWS_REGION", "AWS_LAMBDA_FUNCTION_NAME",
  "AWS_LAMBDA_FUNCTION_MEMORY_SIZE", "LAMBDA_TASK_ROOT", "LAMBDA_RUNTIME_DIR",
  "AWS_EXECUTION_ENV"
] as const;

export const functionEnvironmentVariable = 
  (name: LambdaFunctionEnvironmentVariable) =>
    Config.nonEmptyString(name);