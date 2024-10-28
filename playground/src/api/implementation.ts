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
                readFileEffect(`.out/${params.path.path}.js`)
              )
              .handle("vendorJs", (params) =>
                readFileEffect(`node_modules/${params.path.path.join("/")}.js`)
              )
              .handle("vendorCss", (params) =>
                readFileEffect(`node_modules/${params.path.path.join("/")}.css`)
              )
          )
        )
      )
}
