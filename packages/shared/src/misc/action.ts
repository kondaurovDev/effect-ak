import { Effect, pipe, Context, Layer, Cause, identity, Logger } from "effect";
import { Schema as S } from "@effect/schema";

import { ActionError, ActionIOError, ActionLog } from "./action-error.js";

export type ActionSuccess<O> = {
  readonly result: O,
  readonly logs: ActionLog[]
}

export type ActionCallbackResult<O, E, R> =
  Effect.Effect<O, E, R> | Promise<O> | O

export type Action<I, O, E, R> = {
  name: string,
  inputTag: Context.Tag<I, I>,
  inputSchema: S.Schema<I>,
  outputSchema: S.Schema<O>,
  run: (_: I) => ActionCallbackResult<O, E, R>,
  inputLayer: (_: I) => Layer.Layer<I>,
  checkedRun: Effect.Effect<ActionSuccess<O>, ActionError<E> | ActionError<unknown> | ActionIOError, I | R>
}

export const makeAction = <I, O, E, R>(
  name: string,
  inputSchema: S.Schema<I>,
  outputSchema: S.Schema<O>,
  run: (_: I) => ActionCallbackResult<O, E, R>,
  getInput: (_: I) => I = identity
): Action<I, O, E, R> => {
  const inputTag =
    Context.GenericTag<I>(`ActionInput.${name}`);

  const inputLayer =
    (input: I) => Layer.succeed(inputTag, inputTag.of(input))

  const checkedRun =
    pipe(
      Effect.Do,
      Effect.let("actionLogs", () => [] as ActionLog[]),
      Effect.bind("actionInput", () => inputTag),
      Effect.bind("parsedInput", ({ actionInput, actionLogs }) =>
        pipe(
          S.validate(inputSchema)(getInput(actionInput)),
          Effect.catchTag("ParseError", parseError =>
            new ActionIOError({
              type: "input",
              actionName: name,
              error: parseError,
              logs: actionLogs
            })
          )
        )
      ),
      Effect.bind("actionResult", ({ parsedInput, actionLogs }) =>
        Effect.async<O, E | Cause.UnknownException, R>((resume) => {
          const liftedResult: Effect.Effect<O, E | Cause.UnknownException, R> = (function () {
            try {
              const callbackResult = run(parsedInput); // Running callback, which can return Effect, Promise, Synchronous value
              if (Effect.isEffect(callbackResult)) {
                return pipe(
                  callbackResult
                )
              } else if (callbackResult instanceof Promise) {
                const a = pipe(
                  Effect.tryPromise<O>(() => callbackResult)
                )
                return a;
              } else {
                return Effect.succeed(callbackResult)
              }
            } catch (error) {
              return Effect.die(error)
            }
          }());
          resume(liftedResult)
        }).pipe(
          Effect.provide(
            Logger.add(
              Logger.make(({ message, date, logLevel, cause }) =>
                actionLogs.push({
                  message,
                  cause: Cause.squash(cause),
                  time: date.toISOString(),
                  level: logLevel.label
                })
              )
            )
          ),
          Effect.catchAll(error => {
            if (Cause.isUnknownException(error)) {
              return new ActionError({
                actionName: name,
                cause: Cause.fail(error),
                details: (error.error as Error).message,
                logs: actionLogs
              })
            } else {
              return new ActionError({
                actionName: name,
                cause: Cause.die(error), 
                logs: actionLogs
              })
            }
          }),
          Effect.catchAllDefect(defect =>
            new ActionError({
              actionName: name,
              cause: Cause.die(defect), 
              logs: actionLogs
            })
          ),
        ),
      ),
      Effect.tap(({ actionResult, actionLogs }) =>
        pipe(
          S.validate(outputSchema)(actionResult),
          Effect.catchTag("ParseError", parseError =>
            new ActionIOError({
              actionName: name,
              type: "output",
              logs: actionLogs,
              error: parseError,
            })
          )
        )
      ),
      Effect.andThen(({ actionResult, actionLogs }) =>
        ({
          result: actionResult,
          logs: actionLogs
        }) as ActionSuccess<O>
      )
    )

  return ({
    name,
    inputTag,
    inputSchema,
    outputSchema,
    run,
    inputLayer,
    checkedRun
  })
};
