import { ParseResult } from "@effect/schema";
import { Data } from "effect";

const errors = {
  NoContent: "Expected to have message with non empty content",
  WrongFinishReason: "Expected other finish reason",
  MissingToolCall: "The response doesn't contain a tool call",
  MissingChoices: "The response doesn't contain choices",
  UnknownResponse: "Unknown response from openAI",
  ClientError: "Error on client side has happened",
  MissingFunctionArguments: "The response doesn't contain function arguments",
  FunctionCallError: "Not valid json",
}

export class CompletionError extends Data.TaggedError("CompletionError")<{
  errorCode: keyof typeof errors,
  cause?: ParseResult.ParseError
}> {

  get message() {
    return errors[this.errorCode];
  }

}