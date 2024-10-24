import { describe, expect, it } from "vitest";
import { ConfigProvider, Console, Effect, Exit, Layer, Logger, LogLevel, pipe } from "effect";

import * as Modules from "../../src/modules"
import * as Api from "../../src/api";
import integrationConfig from "../../integration-config.json"

const live =
  Layer.mergeAll(
    Modules.Spreadsheet.SheetValueService.Default,
    Logger.pretty
  ).pipe(
    Layer.provide(
      Layer.setConfigProvider(
        ConfigProvider.fromJson({
          [Api.googleUserAccessTokenConfigKey]: integrationConfig.authResponse.access_token
        })
      )
    ),  
    Layer.tapError(error =>
      Console.error(error)
    )
  )

describe("spreadsheet values, test suite", () => {

  it("append rows", async () => {

    const testSpreadsheet = Modules.Spreadsheet.SpreadsheetId.make("1Z1TXBW110UtB599BAsKUHSamqnrAINbBGLqxeShdNhc");

    const appendValues = (
      range: string,
      values: Modules.Spreadsheet.AppendValuesToSheetCommandInput["valueRange"]["values"]
    ) =>
      pipe(
        Modules.Spreadsheet.SheetValueService,
        Effect.andThen(service =>
          service.appendValues({
            spreadsheetId: testSpreadsheet,
            valueRange: {
              majorDimension: "ROWS",
              range,
              values
            }
          })
        )
      )

    const actual =
      await pipe(
          Effect.all([
            appendValues(
              "List2",
              [
                ["000", 3, 10, "last" ],
                ["000", 3, 10, "last" ],
                ["000", 3, 10, "last" ]
              ]
            ),
            appendValues(
              "List2",
              [
                ["111", 3, 10, "last" ],
                ["111", 3, 10, "last" ],
                ["111", 3, 10, "last" ]
              ]
            ),
            appendValues(
              "List2",
              [
                ["333", 3, 10, "last" ],
                ["333", 3, 10, "last" ],
                ["333", 3, 10, "last" ]
              ]
            ),
          ], { concurrency: "unbounded" }),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.provide(live),
        Effect.runPromiseExit
      )

    expect(actual).toEqual(Exit.succeed)
    
  })

})