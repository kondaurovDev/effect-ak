import * as S from "effect/Schema";

export class TranscribeVoiceResponse
  extends S.Class<TranscribeVoiceResponse>("TranscribeVoiceResponse")({
    metadata: S.Unknown,
    results: 
      S.Struct({
        channels: 
          S.Struct({
            alternatives:
              S.Struct({
                transcript: S.String
              }).pipe(
                S.NonEmptyArray
              )
          }).pipe(
            S.NonEmptyArray
          )
      })
  }) {}
