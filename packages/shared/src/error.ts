import { Data } from "effect"

export class MiscError 
  extends Data.TaggedError("MiscError")<{
    message: string
  }> {}