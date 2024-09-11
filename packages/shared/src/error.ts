import { ParseResult } from "@effect/schema"
import { Cause, Data } from "effect"

const packageName = "@efkit/shared"

export class UtilError
  extends Data.TaggedError(`${packageName}.SharedError`)<{
    name: "text" | "date" | "json",
    cause?: Error,
    details?: unknown
  }> {}

export class ActionError<E = Error>
  extends Data.TaggedError(`${packageName}.ActionError`)<{
    cause: E | Cause.UnknownException
  }> { }

export class ActionInvalidIOError
  extends Data.TaggedError(`${packageName}.ActionInvalidIOError`)<{
    type: "input" | "output"
    cause: ParseResult.ParseError
  }> { }

export class PromiseError<E>
  extends Data.TaggedError(`${packageName}.PromiseError`)<{
    actionName: string,
    cause: E
  }> { }

export class PromiseSchemaError
  extends Data.TaggedError(`${packageName}.PromiseSchemaError`)<{
    actionName: string,
    cause: Error
  }> { }
