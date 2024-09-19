import { Effect, pipe, Context, Layer, Cause, identity, Logger } from "effect";
import { Schema as S } from "@effect/schema";

import { ActionError, ActionInvalidIOError, ActionLog } from "./action-error.js";

export type ActionSuccess<O> = {
  readonly result: O,
  readonly logs: ActionLog[]
}

export type ActionResult<O, E, R> =
  Effect.Effect<O, E, R> | Promise<O> | O

export type Action<I, O, E, R> = {
  name: string,
  inputTag: Context.Tag<I, I>,
  inputSchema: S.Schema<I>,
  outputSchema: S.Schema<O>,
  run: (_: I) => ActionResult<O, E, R>,
  inputLayer: (_: I) => Layer.Layer<I>,
  checkedRun: Effect.Effect<ActionSuccess<O>, ActionError<E> | ActionInvalidIOError, I | R>
}

export const makeAction = <I, O, E, R>(
  name: string,
  inputSchema: S.Schema<I>,
  outputSchema: S.Schema<O>,
  run: (_: I) => ActionResult<O, E, R>,
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
            new ActionInvalidIOError({ type: "input", cause: Cause.fail(parseError), logs: actionLogs, actionName: name })
          )
        )
      ),
      Effect.bind("actionResult", ({ parsedInput, actionLogs }) =>
        Effect.async<O, E | Cause.UnknownException, R>((resume) => {
          try {
            const result = run(parsedInput)
            if (Effect.isEffect(result)) {
              const live = 
                Logger.add(
                  Logger.make(({ message, date, logLevel, cause }) => 
                    actionLogs.push({
                      message,
                      cause: cause,
                      time: date.toISOString(),
                      level: logLevel.label
                    })
                  )
                )
              return resume(Effect.provide(live)(result))
            } else if (result instanceof Promise) {
              console.log = function(...args) {
                actionLogs.push({
                  message: args[0],
                  time: Date.now(),
                  level: "info",
                  cause: args.find(_ => _ instanceof Error)
                });
              };
              resume(Effect.tryPromise(() => result))
            } else {
              return resume(Effect.succeed(result))
            }
          } catch (e) {
            resume(Effect.fail(e as E))
          }
        }).pipe(
          Effect.catchAllCause(error =>
            new ActionError({ cause: error, logs: actionLogs, actionName: name })
          )
        ),
      ),
      Effect.tap(({ actionResult, actionLogs }) =>
        pipe(
          S.validate(outputSchema)(actionResult),
          Effect.catchTag("ParseError", parseError =>
            new ActionInvalidIOError({ type: "output", cause: Cause.fail(parseError), logs: actionLogs, actionName: name })
          )
        )
      ),
      Effect.andThen(({ actionResult, actionLogs }) => ({
        result: actionResult, logs: actionLogs
      }) as ActionSuccess<O>)
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
