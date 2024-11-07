import type { HttpClientError } from "@effect/platform"
import type { ParseResult, Cause } from "effect"
import * as Data from "effect/Data"

export class TgBotApiClientError
  extends Data.TaggedError("TgBotApiClientError")<{
    cause: ParseResult.ParseError | HttpClientError.RequestError | Cause.UnknownException
  }> {}

export class TgBotApiServerError
  extends Data.TaggedError("TgBotApiServerError")<{
    cause: ParseResult.ParseError | HttpClientError.ResponseError
  }> {}
