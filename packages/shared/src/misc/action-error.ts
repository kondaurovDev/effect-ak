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
    cause: Cause.Cause<E | Cause.UnknownException>,
    logs: ActionLog[]
  }> { }

export class ActionIOError
  extends Data.TaggedError(`${packageName}.ActionInvalidIOError`)<{
    actionName: string,
    type: "input" | "output"
    cause: ParseResult.ParseError,
    logs: ActionLog[]
  }> { }

export const isActionError = <E>(
  error: ActionError<E> | ActionIOError
): error is ActionError<E> =>
  !("type" in error)

export const isActionIOError = <E>(
  error: ActionError<E> | ActionIOError
): error is ActionError<E> =>
  ("type" in error)
