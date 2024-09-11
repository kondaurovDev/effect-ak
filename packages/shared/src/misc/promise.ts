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
    Effect.catchTag("UnknownException", (exception) =>
      pipe(
        Effect.logDebug(`promise exception (${actionName})`, exception.cause),
        Effect.andThen(S.validate(errorSchema)(exception.error)),
        Effect.matchEffect({
          onSuccess: error => new PromiseError({ actionName, cause: error }),
          onFailure: () => new PromiseSchemaError({ actionName, cause: exception })
        })
      )
    )
  )
