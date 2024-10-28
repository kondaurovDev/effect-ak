import { HttpApi, HttpApiBuilder } from "@effect/platform";
import { Effect, Layer, pipe } from "effect";

import { readFile } from "fs/promises"
import { Endpoints } from "./definition.js";
import { htmlPage } from "./enrypoint.js";

const readFileEffect = (
  path: string
) =>
  pipe(
    Effect.succeed(__dirname + `/../../${path}`),
    Effect.tap(_ => Effect.logInfo("reading file", _)),
    Effect.andThen(file =>
      Effect.tryPromise(() => readFile(file))
    ),
    Effect.andThen(_ => _.toString("utf-8")),
    Effect.orDie
  )

export class BackendApi
  extends HttpApi.empty.add(Endpoints) {

  static live =
    HttpApiBuilder.api(BackendApi)
      .pipe(
        Layer.provide(
          HttpApiBuilder.group(BackendApi, "endpoints", handlers =>
            handlers
              .handle("rootPage", () =>
                Effect.succeed(htmlPage("main"))
              )
              .handle("transcribeHtmlPage", () =>
                Effect.succeed(htmlPage("transcribe"))
              )
              .handle("vue-component", (params) =>
                params.path.path.endsWith(".map") ?
                  pipe(
                    readFileEffect(`.out/${params.path.path}.js.map`),
                    Effect.andThen(input =>
                      Effect.try(() => JSON.parse(input))
                    ),
                    Effect.die
                  ) :
                  readFileEffect(`.out/${params.path.path}.js`)
              )
              .handle("vue-component-style", (params) =>
                readFileEffect(`.out/${params.path.path}.css`)
              )
              .handle("vendorJs", (params) =>
                params.path.path.at(-1)?.endsWith(".js.map") ?
                  pipe(
                    Effect.logInfo("reading vendor js source map file"),
                    Effect.andThen(
                      readFileEffect(`node_modules/${params.path.path.join("/")}`)
                    ),
                    Effect.andThen(input =>
                      Effect.try(() => JSON.parse(input))
                    ),
                    Effect.die
                  ) :
                  readFileEffect(`node_modules/${params.path.path.join("/")}`)
              )
              .handle("vendorCss", (params) =>
                readFileEffect(`node_modules/${params.path.path.join("/")}.css`)
              )
          )
        )
      )
}
