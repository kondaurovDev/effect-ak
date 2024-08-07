import { Data } from "effect";
import { ParseResult } from "@effect/schema";
import { HttpBody } from "@effect/platform";

import { TgResponse } from "./rest-client";

export class TgApiError extends Data.TaggedError("TgApiError")<{
  response: TgResponse
}> {
  get message() {
    return JSON.stringify(this.response);
  }
}

export class ContractError extends Data.TaggedError("ContractError")<{
  type: "request" | "response" | "api"
  parseError?: ParseResult.ParseError
  bodyError?: HttpBody.HttpBodyError
}> {

  get message() {
    return `${this.type}: ${this.parseError?.message || this.bodyError || "Unknown" }` ;
  }

}

export class TgBotError extends Data.TaggedError("TgBotError")<{
  message: string
}> {}

export class UnknownTgUpdate extends Data.TaggedError("UnknownTgUpdate") {}