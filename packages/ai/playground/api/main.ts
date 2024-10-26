import { HttpApi, HttpApiBuilder, FileSystem, Path, HttpApiGroup } from "@effect/platform";
import { Effect, Layer, pipe } from "effect";

import { VoiceApi } from "./voice-api";

export class BackendApi
  extends HttpApi.empty.add(VoiceApi) {

  static live =
    HttpApiBuilder.api(
      BackendApi
    ).pipe(
      Layer.provide(
        HttpApiBuilder.group(BackendApi, "voiceApi", handlers =>
          handlers
              .handle("transcribe", () => Effect.succeed(1))
              .handle("echo", () => Effect.succeed("echo :)"))
              .handle("getTranscribe", () => Effect.succeed("send post request"))
              .handle("root", () => Effect.succeed(1))
        )
      )
    )
}
