import { HttpClientError } from "@effect/platform"
import { ParseResult } from "@effect/schema"
import { Data, Match, pipe } from "effect"
import { TgResponse } from "../domain/tg-response.js"

export class TgBotApiClientError
  extends Data.TaggedError("TgBotApiClientError")<{
    cause: ParseResult.ParseError | HttpClientError.RequestError
  }> {}

export class TgBotApiServerError
  extends Data.TaggedError("TgBotApiServerError")<{
    cause: ParseResult.ParseError | TgResponse | HttpClientError.ResponseError
  }> {

    get message() {
      return pipe(
        Match.value(this.cause),
        Match.when(({ _tag: "ParseError" }), error => error.message),
        Match.when(({ _tag: "ResponseError" }), error => error.message),
        Match.orElse(tgResponse => JSON.stringify(tgResponse))
      )
    }

  }