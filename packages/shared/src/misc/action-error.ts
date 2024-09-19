import { ParseResult } from "@effect/schema"
import { Cause, Data } from "effect"
import { packageName } from "../common.js"

export type ActionLog = {
  message: unknown,
  time: unknown
  level: unknown
  cause: unknown
}

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
