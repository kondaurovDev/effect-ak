import { Cause, Data } from "effect"
import { ParseResult } from "@effect/schema"

import { packageName } from "../common.js"

export type ActionLog = {
  message: unknown,
  time: unknown
  level: unknown
  cause: unknown
}

export class ActionError<E>
  extends Data.TaggedError(`${packageName}.ActionError`)<{
    actionName: string,
    cause: Cause.Cause<E> | Cause.Cause<Cause.UnknownException>,
    logs: ActionLog[]
  }> { }

export class ActionIOError
  extends Data.TaggedError(`${packageName}.ActionIOError`)<{
    type: "input" | "output",
    actionName: string,
    error: ParseResult.ParseError,
    logs: ActionLog[]
  }> { }
