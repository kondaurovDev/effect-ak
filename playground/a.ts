import { Config, ConfigProvider, Effect, Layer, pipe } from "effect"

class MyService extends Effect.Service<MyService>()("MyService", {
  effect:
    Effect.gen(function* () {
      const confValue = yield* Config.nonEmptyString("conf1");

      console.log("initiated service config", confValue);

      const method = (
        message: string
      ) => {
        console.log("running method", message);
        return pipe(
          Config.nonEmptyString("bar").pipe(Config.nested("conf2")),
          Effect.andThen(val =>
            console.log("from method", val)
          )
        )
      }
        
      return {
        method
      } as const;
    })
}) {}

const live = 
  Layer.mergeAll(
    MyService.Default
  ).pipe(
    Layer.provide(
      Layer.setConfigProvider(
        ConfigProvider.fromJson({
          conf1: "foo",
          conf2: {
            bar: "baz"
          }
        })
      )
    )
  )

pipe(
  MyService,
  Effect.andThen(_ => _.method("bar")),
  Effect.provide(live),
  Effect.runSync
)
