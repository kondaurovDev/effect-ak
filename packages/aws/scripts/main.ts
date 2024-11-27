import * as Effect from "effect/Effect"

import { generateCommandsSection } from "./gen/commands"
import { makeMorphProject } from "./gen";
import { generateExceptionsSection } from "./gen/exceptions";
import { generateClientSection } from "./gen/client";

export type Input = {
  moduleName: string,
  target: string,
} & ReturnType<typeof makeMorphProject>;

await Effect.gen(function* () {

  // const input = { moduleName: "lambda", target: "lambda" }
  // const input = { moduleName: "dynamodb-streams", target: "dynamodb-streams" }
  // const input = { moduleName: "sqs", target: "sqs" }
  const input = { moduleName: "sts", target: "sts" }

  const project = makeMorphProject(input);

  yield* generateClientSection({ ...input, ...project });
  yield* generateCommandsSection({ ...input, ...project });
  yield* generateExceptionsSection({ ...input, ...project });

}).pipe(
  Effect.tapErrorCause(Effect.logWarning),
  Effect.runPromise
)
