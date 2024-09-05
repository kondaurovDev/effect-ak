import { Effect, Data, pipe, Context, Brand, Layer, Match } from "effect";
import { Schema as S, ParseResult } from "@effect/schema";

export type ActionName = string & Brand.Brand<"ActionName">;
export const ActionName = Brand.nominal<ActionName>();

export type ActionResult<O = unknown, E = unknown, R = never> = 
  Effect.Effect<O, E, R> | Promise<O> | O

export type ActionInput<T = unknown> = {
  readonly input: T
}

export type Action<I, O, E, R> = {
  inputTag: Context.Tag<ActionInput<I>, ActionInput<I>>,
  inputSchema: S.Schema<I>,
  outputSchema: S.Schema<O>,
  action: (_: I) => ActionResult<O, E, R>,
  createInput: (_: I) => Layer.Layer<ActionInput<I>>,
  actionWithInput: Effect.Effect<O, ActionError, ActionInput<I> | R>
}

export const Action = <I, O, E, R>(
  name: ActionName,
  inputSchema: S.Schema<I>,
  outputSchema: S.Schema<O>,
  action: (_: I) => ActionResult<O, E, R>,
  getInput: (_: ActionInput) => I = _ => _.input as I,
): Action<I, O, E, R> => {
  const inputTag =
    Context.GenericTag<ActionInput<S.Schema.Type<typeof inputSchema>>>(`ActionInput.${name}`);

  return ({
    inputTag,
    inputSchema,
    outputSchema,
    action,
    createInput:
      input =>
        Layer.succeed(
          inputTag,
          inputTag.of({ input })
        ),
    actionWithInput:
      Effect.Do.pipe(
        Effect.bind("actionInput", () => inputTag),
        Effect.bind("parsedInput", ({ actionInput }) =>
          pipe(
            S.validate(inputSchema)(getInput(actionInput)),
            Effect.mapError(parseError => 
              new ActionError({ cause: parseError })
            )
          )
        ),
        Effect.bind("actionResult", ({ parsedInput }) =>
          pipe(
            Effect.async<O, E, R>((resume) => {
              try {
                const result = action(parsedInput)
                if (Effect.isEffect(result)) {
                  return resume(result)
                } else if (result instanceof Promise) {
                  resume(
                    pipe(
                      Effect.tryPromise(() => result),
                      Effect.mapError(error => error as unknown as E)
                    )
                )
                } else {
                  return resume(Effect.succeed(result))
                }
              } catch (e) {
                resume(Effect.fail(e as E))
              }
            }),
            Effect.tapError(error => 
              Effect.logWarning(error)
            ),
            Effect.mapError((executionError) =>
              new ActionError({ cause: executionError })
            )
          )
        ),
        Effect.andThen(({ actionResult }) =>
          pipe(
            S.validate(outputSchema)(actionResult),
            Effect.catchTag("ParseError", parseError => 
              new ActionError({ cause: parseError })
            )
          )
        )
      )
  })
};

export class ActionError extends Data.TaggedError("ActionError")<{
  cause: unknown
}> {

  // get message() {
  //   return pipe(
  //     Match.value(this.error),
  //     Match.when(
  //       { type: "ExecutionError" }, 
  //       error => {
  //         const errorDetails = 
  //           error.executionError instanceof Error ? error.executionError.message : error.executionError;
  //         return `Execution error (${errorDetails})`
  //       }
  //     ),
  //     Match.orElse(error =>
  //       `${error.type}: ${error.parseError.message}`
  //     )
  //   )
  // }

}
