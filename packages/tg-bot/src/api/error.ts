import { HttpClientError } from "@effect/platform"
import { ParseResult } from "@effect/schema"
import { ConfigError, Data } from "effect"
import { PlatformError } from "@effect/platform/Error"

export class TgBotApiClientError
  extends Data.TaggedError("TgBotApiClientError")<{
    cause: ParseResult.ParseError | HttpClientError.RequestError | ConfigError.ConfigError
  }> {}

export class TgBotApiServerError
  extends Data.TaggedError("TgBotApiServerError")<{
    cause: ParseResult.ParseError | HttpClientError.ResponseError
  }> { }

export class TgBotApiDownloadFileError 
  extends Data.TaggedError("TgBotApiDownloadFileError")<{
    cause: PlatformError | ConfigError.ConfigError | HttpClientError.HttpClientError
  }> {}