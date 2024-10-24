import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import * as S from "effect/Schema";

export class VoiceApi extends
  HttpApiGroup.make("voiceApi").pipe(
    HttpApiGroup.add(
      HttpApiEndpoint.get("root", "/").pipe(
        HttpApiEndpoint.setSuccess(S.Unknown)
      ),
    ),
    HttpApiGroup.add(
      HttpApiEndpoint.get("echo", "/echo").pipe(
        HttpApiEndpoint.setSuccess(S.Unknown)
      )
    ),
    HttpApiGroup.add(
      HttpApiEndpoint.post("transcribe", "/transcribe").pipe(
        HttpApiEndpoint.setSuccess(S.Unknown)
      )
    ),
    HttpApiGroup.add(
      HttpApiEndpoint.get("getTranscribe", "/transcribe").pipe(
        HttpApiEndpoint.setSuccess(S.Unknown)
      )
    )
  ) {}
