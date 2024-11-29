import * as Effect from "effect/Effect"

import { generateCommandsSection } from "./code-sections/commands"
import { generateExceptionsSection } from "./code-sections/exceptions";
import { generateClientSection } from "./code-sections/client";
import { makeMorphProject } from "./make-project";

export type Input = {
  moduleName: string,
} & ReturnType<typeof makeMorphProject>;

const generateOneClient =
  (input: { moduleName: string }) =>
    Effect.gen(function* () {
      yield* Effect.logInfo(`Generate client (${input.moduleName}) =>`);
      const project = yield* Effect.try(() => makeMorphProject(input));
      yield* generateClientSection({ ...input, ...project });
      yield* generateCommandsSection({ ...input, ...project });
      yield* generateExceptionsSection({ ...input, ...project });
    });

export const generateManyClients =
  (clients: string[]) =>
    Effect.gen(function* () {
      yield* Effect.forEach(clients, clientName => {
        return generateOneClient({ moduleName: clientName });
      })
    })
