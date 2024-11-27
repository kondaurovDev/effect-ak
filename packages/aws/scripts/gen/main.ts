import * as Effect from "effect/Effect"

import { generateCommandsSection } from "./code-sections/commands"
import { generateExceptionsSection } from "./code-sections/exceptions";
import { generateClientSection } from "./code-sections/client";
import { makeMorphProject } from "./make-project";

export type Input = {
  moduleName: string,
  target: string,
} & ReturnType<typeof makeMorphProject>;

const generateOneClient =
  (input: { moduleName: string, target: string }) =>
    Effect.gen(function* () {
      yield* Effect.logInfo(`Generate client (${input.moduleName}) =>`);
      const project = yield* Effect.try(() => makeMorphProject(input));
      yield* generateClientSection({ ...input, ...project });
      yield* generateCommandsSection({ ...input, ...project });
      yield* generateExceptionsSection({ ...input, ...project });
    });

const generateManyClients =
  Effect.gen(function* () {
    yield* Effect.forEach(getClients(), clientName => {
      const [moduleName, targetName] = clientName.split(":");
      return generateOneClient({ moduleName, target: targetName ?? moduleName });
    })
  })

await generateManyClients.pipe(
  Effect.tapErrorCause(Effect.logWarning),
  Effect.runPromise
);

function getClients() {
  return [
    "apigatewayv2:api-gateway",
    // "cloudwatch",
    // "dynamodb",
    // "dynamodb-streams",
    // "iam",
    // "kms",
    // "lambda",
    // "resource-groups-tagging-api:resource-groups",
    // "s3",
    // "sqs",
    // "ssm",
    // "sts"
  ];
}

