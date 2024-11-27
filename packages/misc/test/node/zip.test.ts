import { describe, it } from "vitest"
import { Effect } from "effect"

import { NodeZipService } from "../../src/node"
import { LogLevelConfigFromEnv } from "../../src/util"

import { writeFile } from "fs/promises"

describe("zip", () => {

  it("zip and write to fs", async () => {

    const program =
      await Effect.gen(function* () {

        const zip = yield* NodeZipService;

        const zipped =
          yield* zip.createZipArchive([
            { type: "file", name: "a/index.js", content: "console.log" },
          ]);

        const writeResult = 
          yield* Effect.tryPromise(() => writeFile(__dirname + "/../out.zip", zipped))

      }).pipe(
        Effect.tapErrorCause(Effect.logError),
        Effect.provide(NodeZipService.Default),
        Effect.provide(LogLevelConfigFromEnv),
        Effect.runPromiseExit
      );

  })

})