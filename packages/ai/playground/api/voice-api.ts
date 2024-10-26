import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import * as S from "effect/Schema";

export class VoiceApi extends
  HttpApiGroup.make("voiceApi")
    .add(HttpApiEndpoint.get("root", "/").addSuccess(S.Unknown))
    .add(HttpApiEndpoint.get("echo", "/echo").addSuccess(S.Unknown))
    .add(HttpApiEndpoint.get("transcribe", "/transcribe").addSuccess(S.Unknown))
    .add(HttpApiEndpoint.get("getTranscribe", "/transcribe").addSuccess(S.Unknown))
{ }
