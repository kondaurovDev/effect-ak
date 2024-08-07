import { CommandExecutor, Command } from "@effect/platform";
import { Effect } from "effect";

export const executeShellCommand = (
  command: readonly [ string, readonly string[] | undefined ]
) =>
  Effect.Do.pipe(
    Effect.let("command", () =>
      Command.make(command[0], ...(command[1] ?? []))
    ),
    Effect.bind("executor", () => CommandExecutor.CommandExecutor),
    Effect.andThen(({ executor, command }) =>
      executor.exitCode(command)
    ),
    Effect.scoped
  )

