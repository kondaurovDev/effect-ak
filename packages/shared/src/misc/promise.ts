import { Effect, pipe } from "effect";
import { Schema as S } from "@effect/schema";

import { PromiseError, PromiseSchemaError } from "../error.js";

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
          onSuccess: error => new PromiseError({ actionName, cause: error }),
          onFailure: () => new PromiseSchemaError({ actionName, cause: exception.error as Error })
        })
      )
    )
  )
