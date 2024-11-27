export type ApiGatewayType = typeof apiGatewayTypes[number];

export const apiGatewayTypes = [
  "https", "wss"
] as const;

export const awsServicesList = [
  "lambda", "ecs-tasks", "apigateway", "s3", "sqs", "sns"
] as const;

export type AwsServiceName = typeof awsServicesList[number];
