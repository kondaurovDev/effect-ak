import { Data, Either } from "effect";

type ExpectedErrorCode = [
  "Failed", "ReturnTypeSentenceNotFound"
][number];

export class NormalTypeError
  extends Data.TaggedError("NormalTypeError")<{
    error: ExpectedErrorCode
  }> {}

export const error = (error: ExpectedErrorCode) =>
  Either.left(new NormalTypeError({ error }))
