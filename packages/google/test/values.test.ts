import { describe, expect, it } from "vitest";
import { Effect, Exit, Layer, Logger, LogLevel, pipe } from "effect";
import { HttpClient, FileSystem } from "@effect/platform";
import { NodeFileSystem } from "@effect/platform-node";

import { appendRowsToPage } from "../src/spreadsheet/value/add-row"
import { GoogleApiRestClientLive } from "../src/client";
import { GoogleUserAccessToken } from "../src/auth/common";
import { SpreadsheetId } from "../src/spreadsheet/common";

const live =
  Layer.mergeAll(
    Layer.effect(
      GoogleUserAccessToken,
      pipe(
        FileSystem.FileSystem,
        Effect.andThen(fs => fs.readFile("token.txt")),
        Effect.andThen(_ => _.toString())
      )
    ),
    Layer.succeed(SpreadsheetId, "1Z1TXBW110UtB599BAsKUHSamqnrAINbBGLqxeShdNhc"),
    GoogleApiRestClientLive
  ).pipe(
    Layer.provide(HttpClient.layer),
    Layer.provide(NodeFileSystem.layer)
  )

describe("spreadsheet values, test suite", () => {

  it("append rows", async () => {

    const actual =
      await pipe(
        Effect.all([
          appendRowsToPage(
            "List2",
            [
              ["000", 3, 10, "last" ],
              ["000", 3, 10, "last" ],
              ["000", 3, 10, "last" ]
            ]
          ),
          appendRowsToPage(
            "List2",
            [
              ["111", 3, 10, "last" ],
              ["111", 3, 10, "last" ],
              ["111", 3, 10, "last" ]
            ]
          ),
          appendRowsToPage(
            "List2",
            [
              ["333", 3, 10, "last" ],
              ["333", 3, 10, "last" ],
              ["333", 3, 10, "last" ]
            ]
          ),
        ], { concurrency: "unbounded" }),
        Effect.withRequestBatching(true),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.provide(live),
        Effect.runPromiseExit
      )

    expect(actual).toEqual(Exit.succeed)
    
  })

})