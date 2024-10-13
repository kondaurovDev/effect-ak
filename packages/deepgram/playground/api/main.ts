import { HttpApi, HttpApiBuilder, FileSystem, Path } from "@effect/platform";
import { Effect, Layer, pipe } from "effect";

import { VoiceApi } from "./voice-api";

export class BackendApi
  extends HttpApi.empty.pipe(HttpApi.addGroup(VoiceApi)) {

  static live =
    HttpApiBuilder.api(
      BackendApi
    ).pipe(
      Layer.provide(
        HttpApiBuilder.group(BackendApi, "voiceApi", handlers =>
          Effect.gen(function* () {
            return handlers.pipe(
              HttpApiBuilder.handle("transcribe", () =>
                Effect.succeed(1)
              ),
              HttpApiBuilder.handle("echo", () =>
                Effect.succeed(
                  "echo :)"
                )
              ),
              HttpApiBuilder.handle("getTranscribe", () =>
                Effect.succeed(
                  "send post request"
                )
              ),
              HttpApiBuilder.handle("root", () =>
                Effect.succeed(1)
              )
            )
          }),
        )
      )
    )
}
