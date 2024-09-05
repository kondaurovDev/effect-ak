import { Data } from "effect"

export class SharedError 
  extends Data.TaggedError("SharedError")<{
    message: string
  }> {}