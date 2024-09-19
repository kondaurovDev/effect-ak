import { Cause, Data, Effect, pipe } from "effect";
import { Schema as S } from "@effect/schema";

import { packageName } from "../common.js";

export class PromiseError<E>
  extends Data.TaggedError(`${packageName}.PromiseError`)<{
    actionName: string,
    cause: Cause.Cause<E>
  }> { }

export class PromiseSchemaError
  extends Data.TaggedError(`${packageName}.PromiseSchemaError`)<{
    actionName: string,
    cause: Cause.Cause<unknown>
  }> { }

export const tryPromise = <O>(
  actionName: string,
  action: () => Promise<O>
): Effect.Effect<O, PromiseError<unknown>> =>
  pipe(
    Effect.logDebug(`executing (${actionName})`),
    Effect.andThen(() => action()),
    Effect.tap(result =>
      Effect.logDebug(`promise success (${actionName})`, result),
    ),
    Effect.catchTag("UnknownException", (exception) =>
      pipe(
        Effect.logDebug(`Promise exception '${actionName}'`, exception.toJSON()),
        Effect.andThen(() =>
          new PromiseError({ actionName, cause: Cause.fail(exception) })
        )
      )
    )
  )

export const trySafePromise = <O, E>(
  actionName: string,
  action: () => Promise<O>,
  errorSchema: S.Schema<E>,
): Effect.Effect<O, PromiseError<E> | PromiseSchemaError> =>
  pipe(
    Effect.logDebug(`executing (${actionName})`),
    Effect.andThen(() => action()),
    Effect.tap(result =>
      Effect.logDebug(`promise success (${actionName})`, result),
    ),
    Effect.catchTag("UnknownException", (exception) =>
      pipe(
        Effect.logDebug(`Promise exception '${actionName}'`, exception.toJSON()),
        Effect.andThen(S.validate(errorSchema)(exception.error)),
        Effect.matchEffect({
          onSuccess: error => new PromiseError({ actionName, cause: Cause.fail(error) }),
          onFailure: () => new PromiseSchemaError({ actionName, cause: Cause.fail(exception) })
        })
      )
    )
  )
