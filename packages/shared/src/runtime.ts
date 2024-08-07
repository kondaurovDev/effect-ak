import {
  Config, Context, Data, Effect, FiberRefs, Layer, Runtime, Scope, pipe
} from "effect";

export class MissingEnv extends Data.TaggedError("MissingEnv")<{
  message: string
}> {}

export const createRuntime = <C>(
  context: Context.Context<C>
) => 
  Runtime.make({
    context: context,
    fiberRefs: FiberRefs.empty(),
    runtimeFlags: Runtime.defaultRuntimeFlags
  });

export const createScope = 
  () => Effect.runSync(Scope.make());

export const createRuntimeFromLayerEffect = <O, E>(
  scope: Scope.CloseableScope,
  layer: Layer.Layer<O, E>
) => 
  pipe(
    Layer.toRuntime(layer),
    Scope.extend(scope)
  )

export const createRuntimeFromLayer = <O, E>(
  scope: Scope.CloseableScope,
  layer: Layer.Layer<O, E>
) => 
  pipe(
    createRuntimeFromLayerEffect(scope, layer),
    Effect.runPromise
  )

export const createRuntimeFromLayerSync = <O, E>(
  scope: Scope.CloseableScope,
  layer: Layer.Layer<O, E>
) => 
  pipe(
    createRuntimeFromLayerEffect(scope, layer),
    Effect.runSync
  )

export const defaultRuntime = Runtime.defaultRuntime

export function getEnv(name: string) {
  return Effect.mapError(
    Config.string(name),
    () => new MissingEnv({ message: `Environment '${name}' isn't defined` })
  )
}
