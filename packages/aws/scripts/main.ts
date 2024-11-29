import * as Effect from "effect/Effect";
import { generateManyClients } from "./gen-clients/main";

const clients = [
  "apigatewayv2",
  "cloudwatch",
  "dynamodb",
  "dynamodb-streams",
  "iam",
  "kms",
  "lambda",
  "resource-groups-tagging-api",
  "s3",
  "sqs",
  "ssm",
  "sts"
]

await generateManyClients(clients).pipe(
  Effect.tapErrorCause(Effect.logWarning),
  Effect.runPromise
);
