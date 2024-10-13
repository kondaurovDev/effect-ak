import { HttpClientError } from "@effect/platform"
import { ParseResult } from "@effect/schema"
import { ConfigError, Data } from "effect"

export class TgBotApiClientError
  extends Data.TaggedError("TgBotApiClientError")<{
    cause: ParseResult.ParseError | HttpClientError.RequestError | ConfigError.ConfigError
  }> {}

export class TgBotApiServerError
  extends Data.TaggedError("TgBotApiServerError")<{
    cause: ParseResult.ParseError | HttpClientError.ResponseError
  }> { }
