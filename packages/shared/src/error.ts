import { ParseResult } from "@effect/schema"
import { Cause, Data } from "effect"

const packageName = "@efkit/shared"

export type ActionLog = {
  message: unknown,
  time: unknown
  level: unknown
  cause: unknown
}

export class UtilError
  extends Data.TaggedError(`${packageName}.SharedError`)<{
    name: "text" | "date" | "json",
    cause?: Error,
    details?: unknown
  }> {}

export class ActionError<E = Error>
  extends Data.TaggedError(`${packageName}.ActionError`)<{
    actionName: string,
    cause: Cause.Cause<E | Cause.UnknownException>,
    logs: ActionLog[]
  }> { }

export class ActionInvalidIOError
  extends Data.TaggedError(`${packageName}.ActionInvalidIOError`)<{
    actionName: string,
    type: "input" | "output"
    cause: Cause.Cause<ParseResult.ParseError>,
    logs: ActionLog[]
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
