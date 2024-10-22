import { HttpClientError } from "@effect/platform"
import { ConfigError, Data, ParseResult } from "effect"

export class TgBotApiClientError
  extends Data.TaggedError("TgBotApiClientError")<{
    cause: ParseResult.ParseError | HttpClientError.RequestError | ConfigError.ConfigError
  }> {}

export class TgBotApiServerError
  extends Data.TaggedError("TgBotApiServerError")<{
    cause: ParseResult.ParseError | HttpClientError.ResponseError
  }> { }
