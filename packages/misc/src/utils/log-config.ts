import { Config, Effect, Layer, LogLevel, Logger, pipe, Console } from "effect";

export const LogLevelConfigFromEnv = 
  pipe(
    Config.logLevel("LOG_LEVEL"),
    Config.withDefault(LogLevel.Info),
    Effect.tap(level =>
      Console.log("Log level =>", level.label)
    ),
    Effect.map(Logger.minimumLogLevel),
    Layer.unwrapEffect
  )
