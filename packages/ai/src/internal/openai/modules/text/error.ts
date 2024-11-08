import { ParseError } from "effect/ParseResult";
import { TaggedError } from "effect/Data";

const errors = {
  NoContent: "Expected to have message with non empty content",
  WrongFinishReason: "Expected other finish reason",
  MissingToolCall: "The response doesn't contain a tool call",
  MissingChoices: "The response doesn't contain choices",
  UnknownResponse: "Unknown response from openAI",
  ClientError: "Error on client side has happened",
  MissingFunctionArguments: "The response doesn't contain function arguments",
  InvalidJson: "Not valid json",
  NoJsonResult: "Json does not contain 'result'",
  MissingRequiredFields: "Input is not complete"
}

export class CompletionError 
  extends TaggedError("CompletionError")<{
  errorCode: keyof typeof errors,
  message?: string
  cause?: ParseError
}> {

  get message() {
    return errors[this.errorCode];
  }

}