import { describe, it, expect } from "vitest"
import { Effect, LogLevel, Logger, pipe } from "effect";
import { NodeContext } from "@effect/platform-node";

import { executeShellCommand } from "../src/shell-executor";

describe("shell executor", () => {

  it("ls -la", async () => {

    const actual = 
      pipe(
        executeShellCommand(["ls", ["-la"] ]),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.provide(NodeContext.layer),
        Effect.runPromiseExit
      );

    expect(actual).toBeDefined();

  });

});
