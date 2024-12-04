import { Effect } from "effect";

import { GenerateNamespaceService } from "./service/namespace.js";
import { makeMainLayer } from "#/layer.js";

const run =
  Effect.gen(function* () {

    const gen = yield* GenerateNamespaceService;

    yield* gen.generate({ namespace: "primary" })

  }).pipe(
    Effect.provide(makeMainLayer({ pagePath: "tg-bot-api.html" })),
    Effect.runPromise
  ) 

run.then(() => console.log("done generating"))
