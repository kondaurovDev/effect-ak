import { Effect, pipe, Context, Layer, Cause, identity, Logger } from "effect";
import { Schema as S } from "@effect/schema";

import { ActionError, ActionInvalidIOError } from "../error.js";

export type ActionLog = {
  message: unknown,
  time: unknown
  level: unknown
}

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
    Context.GenericTag<typeof inputSchema.Type>(`ActionInput.${name}`);

  const inputLayer =
    (input: I) => Layer.succeed(inputTag, inputTag.of(input))

  const checkedRun =
    pipe(
      Effect.Do,
      Effect.let("actionLogs", () => [] as ActionLog[]),
      Effect.bind("actionInput", () => inputTag),
      Effect.bind("parsedInput", ({ actionInput }) =>
        pipe(
          S.validate(inputSchema)(getInput(actionInput)),
          Effect.catchTag("ParseError", parseError =>
            new ActionInvalidIOError({ type: "input", cause: parseError })
          )
        )
      ),
      Effect.bind("actionResult", ({ parsedInput, actionLogs }) =>
        pipe(
          Effect.async<O, E | Cause.UnknownException, R>((resume) => {
            try {
              const result = run(parsedInput)
              if (Effect.isEffect(result)) {
                const live = 
                  Logger.replace(
                    Logger.defaultLogger,
                    Logger.make(({ message, date, logLevel }) => 
                      actionLogs.push({
                        message: message,
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
                    level: "info"
                  });
                };
                resume(Effect.tryPromise(() => result))
              } else {
                return resume(Effect.succeed(result))
              }
            } catch (e) {
              resume(Effect.fail(e as E))
            }
          }),
          Effect.mapError((executionError) =>
            new ActionError({ cause: executionError })
          )
        )
      ),
      Effect.tap(({ actionResult }) =>
        pipe(
          S.validate(outputSchema)(actionResult),
          Effect.catchTag("ParseError", parseError =>
            new ActionInvalidIOError({ type: "output", cause: parseError })
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
