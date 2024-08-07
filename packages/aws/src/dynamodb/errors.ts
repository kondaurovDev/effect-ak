import { Data } from "effect"

export class DynamoDbError 
  extends Data.TaggedError("DynamoDbError")<{
    message: string
  }>  {}