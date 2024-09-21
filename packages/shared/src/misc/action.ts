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
  checkedRun: Effect.Effect<ActionSuccess<O>, ActionError<Cause.Cause<E | Cause.UnknownException>> | ActionIOError, I | R>
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
              type: "input", cause: parseError, logs: actionLogs, actionName: name
            })
          )
        )
      ),
      Effect.bind("actionResult", ({ parsedInput, actionLogs }) =>
        Effect.async<O, Cause.Cause<E | Cause.UnknownException>, R>((resume) => {

          // capturing logs
          console.log = function (...args) {
            actionLogs.push({
              message: args[0],
              time: Date.now(),
              level: "info",
              cause: args.find(_ => _ instanceof Error)
            });
          };

          const liftedResult: Effect.Effect<O, Cause.Cause<E | Cause.UnknownException>, R> = (function () {
            try {
              const callbackResult = run(parsedInput); // Running callback, which can return Effect, Promise, Synchronous value
              if (Effect.isEffect(callbackResult)) {
                return pipe(
                  callbackResult,
                  Effect.sandbox
                )
              } else if (callbackResult instanceof Promise) {
                const a = pipe(
                  Effect.tryPromise<O>(() => callbackResult),
                  Effect.sandbox
                )
                return a;
              } else {
                return Effect.succeed(callbackResult)
              }
            } catch (error) {
              return Effect.fail(Cause.fail(new Cause.UnknownException({ error })))
            }
          }());

          resume(liftedResult)
        }).pipe(
          Effect.provide(
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
          ),
          Effect.catchAllCause(error =>
            new ActionError({
              cause: error, logs: actionLogs, actionName: name
            })
          ),
          Effect.catchAllDefect(defect =>
            new ActionError({
              cause: Cause.die(defect), logs: actionLogs, actionName: name
            })
          ),
        ),
      ),
      Effect.tap(({ actionResult, actionLogs }) =>
        pipe(
          S.validate(outputSchema)(actionResult),
          Effect.catchTag("ParseError", parseError =>
            new ActionIOError({
              type: "output",
              logs: actionLogs, actionName: name,
              cause: parseError
            })
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
