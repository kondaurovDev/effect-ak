import { CommandExecutor, Command } from "@effect/platform";
import { Effect, pipe } from "effect";

export const executeShellCommand = (
  command: readonly [ string, readonly string[] | undefined ]
) =>
  pipe(
    Effect.Do,
    Effect.let("command", () =>
      Command.make(command[0], ...(command[1] ?? []))
    ),
    Effect.bind("executor", () => CommandExecutor.CommandExecutor),
    Effect.andThen(({ executor, command }) =>
      executor.exitCode(command)
    )
  )
