import { Schema as S } from "@effect/schema";

export class TextTranscriptionResponse extends 
  S.Class<TextTranscriptionResponse>("TextTranscriptionResponse")({
    text: S.String
  }) {}

export class VerboseTranscriptionResponse extends 
  S.Class<VerboseTranscriptionResponse>("VerboseTranscriptionResponse")({
    language: S.String,
    duration: S.Number,
    text: S.String,
    words: S.Unknown.pipe(S.Array, S.optional),
    segments: S.Unknown.pipe(S.Array, S.optional),
  }) {}

export const OneOfTranscriptionResponse =
  S.Union(
    TextTranscriptionResponse,
    VerboseTranscriptionResponse
  )
