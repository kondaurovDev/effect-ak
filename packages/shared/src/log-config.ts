import { Config, Effect, Layer, LogLevel, Logger, pipe } from "effect";

export const LogLevelConfigFromEnvLive = 
  pipe(
    Config.logLevel("LOG_LEVEL"),
    Config.withDefault(LogLevel.Info),
    Effect.map(level =>
      Logger.minimumLogLevel(level)
    ),
    Layer.unwrapEffect
  )