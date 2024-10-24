import { Effect, pipe, Context, Layer, Cause, identity, Logger, Data } from "effect";
import * as S from "effect/Schema"
import { ActionError, ActionIOError, ActionLog } from "./action-error.js";
import { packageName } from "../common.js";

export class ActionSuccess<O>
  extends Data.TaggedClass(`${packageName}.ActionSuccess`)<{
    result: O,
    logs: ActionLog[]
  }> { }

export type ActionCallbackResult<O, E, R> =
  Effect.Effect<O, E, R> | Promise<O> | O

export interface Action<I = unknown, O = unknown, E = never, R = never> {
  readonly name: string,
  readonly inputTag: Context.Tag<I, I>,
  readonly inputSchema: S.Schema<I>,
  readonly outputSchema: S.Schema<O>,
  readonly run: (_: I) => ActionCallbackResult<O, E, R>,
  readonly inputLayer: (_: I) => Layer.Layer<I>,
  readonly checkedRun: Effect.Effect<ActionSuccess<O>, ActionError<E> | ActionError<unknown> | ActionIOError, I | R>
}

export const makeAction = <I = unknown, O = unknown, E = never, R = never>(
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
        Effect.async<O, Cause.Cause<E> | Cause.Cause<Cause.UnknownException>, R>((resume) => {
          const liftedResult = (function () {
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
              const a = Effect.fail(Cause.fail(new Cause.UnknownException(error)))
              return a;
            }
          }());
          resume(liftedResult)
        }).pipe(
          Effect.catchAll(error => 
            new ActionError({
              actionName: name,
              cause: error,
              logs: actionLogs
            })
          ),
          Effect.catchAllDefect(defect =>
            new ActionError({
              actionName: name,
              cause: Cause.die(defect),
              logs: actionLogs
            })
          ),
          Effect.provide(
            Logger.add(
              Logger.make(({ message, date, logLevel, cause }) =>
                actionLogs.push({
                  message,
                  cause: Cause.pretty(cause, { renderErrorCause: true }),
                  time: date.toISOString(),
                  level: logLevel.label
                })
              )
            )
          )
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
        new ActionSuccess({
          result: actionResult,
          logs: actionLogs
        })
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
