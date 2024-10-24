import { ConfigProvider, Console, Effect, Logger, LogLevel, pipe } from "effect";
import { Terminal } from "@effect/platform";

import { OAuth2Service } from "../src/api";
import { AccessTokenFromFile, configKeys } from "../src/misc";
import { live } from "./live";

const program =
  Effect.gen(function* () {

    const oauth2Service = yield* OAuth2Service;
    const accessTokenFromFile = yield* AccessTokenFromFile;
    const terminal = yield* Terminal.Terminal;

    const authUrl = oauth2Service.authUrl;

    yield* Console.log(authUrl);

    yield* terminal.display("Enter oauth2 code: ");

    const code = yield* terminal.readLine;

    const response = yield* oauth2Service.exchangeCode(code);

    return yield* accessTokenFromFile.saveResponse(response)

  });

await pipe(
  program,
  Logger.withMinimumLogLevel(LogLevel.Debug),
  Effect.provide(live),
  Effect.withConfigProvider(
    ConfigProvider.fromMap(
      new Map([
        [ configKeys.configPath, __dirname + "/../integration-config.json" ]
      ]))
  ),
  Effect.runPromise
)

