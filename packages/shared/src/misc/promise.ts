import { Data, Effect, pipe } from "effect";

import { packageName } from "../common.js";

export class PromiseError<E>
  extends Data.TaggedError(`${packageName}.PromiseError`)<{
    actionName: string,
    typedError: E
  }> { }

export class PromiseUnknownError
  extends Data.TaggedError(`${packageName}.PromiseUnknownError`)<{
    actionName: string,
    error: unknown
  }> { }

export class PromiseSuccess<A>
  extends Data.TaggedError(`${packageName}.PromiseSuccess`)<{
    actionName: string,
    success: A
  }> { }

export type Constructor<T> = new (...args: any[]) => T;

export const liftPromiseToEffect = <O, E>(
  actionName: string,
  action: () => PromiseLike<O>,
  errorFactory: Constructor<E>
) =>
  pipe(
    Effect.tryPromise({
      try: action,
      catch: exception =>
        exception instanceof errorFactory ?
          new PromiseError({
            actionName,
            typedError: exception
          }) :
          new PromiseUnknownError({
            actionName,
            error: exception
          })
    }),
    Effect.map(result =>
      new PromiseSuccess({ actionName, success: result })
    )
  )
