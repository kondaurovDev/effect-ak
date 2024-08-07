import { Data } from "effect";

export class CompletionError extends Data.TaggedError("Claude.CompletionError")<{
  message: string
}> {}