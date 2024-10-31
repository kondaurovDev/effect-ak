import { HttpClientError } from "@effect/platform"
import { Data, ParseResult, Cause } from "effect"

export class TgBotApiClientError
  extends Data.TaggedError("TgBotApiClientError")<{
    cause: ParseResult.ParseError | HttpClientError.RequestError | Cause.UnknownException
  }> {}

export class TgBotApiServerError
  extends Data.TaggedError("TgBotApiServerError")<{
    cause: ParseResult.ParseError | HttpClientError.ResponseError
  }> {}
