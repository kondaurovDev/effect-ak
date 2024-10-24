import { ConfigProvider, Effect, Logger, LogLevel, pipe } from "effect";
import { AccessTokenFromFile } from "../src/misc";
import { live } from "./live";

const program =
  Effect.gen(function* () {

    const accessTokenFromFile = yield* AccessTokenFromFile;

    yield* accessTokenFromFile.refreshAccessTokenAndSave

  });

const actual =
  await pipe(
    program,
    Logger.withMinimumLogLevel(LogLevel.Debug),
    Effect.provide(live),
    Effect.withConfigProvider(
      ConfigProvider.fromJson({
        tokenDir: __dirname + "/../artifacts"
      })
    ),
    Effect.runPromise
  )
