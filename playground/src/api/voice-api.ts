import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "@effect/platform"
import * as S from "effect/Schema";

export class VoiceApi extends
  HttpApiGroup.make("voiceApi")
    .add(HttpApiEndpoint.get("root", "/").addSuccess(S.Unknown))
    .add(HttpApiEndpoint.get("echo", "/echo").addSuccess(S.Unknown))
    .add(
      HttpApiEndpoint
        .get("vueComponent", "/out/res.js")
        .addSuccess(HttpApiSchema.Text({ contentType: "text/html" }))
    )
    .add(
      HttpApiEndpoint
        .get("transcribeHtmlPage", "/transcribe")
        .addSuccess(HttpApiSchema.Text({ contentType: "text/html" }))
    )
{ }