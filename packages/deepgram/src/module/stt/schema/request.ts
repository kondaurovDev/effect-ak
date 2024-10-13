import { Schema as S } from "@effect/schema";

export class TranscribeVoiceRequest
  extends S.Class<TranscribeVoiceRequest>("TranscribeVoiceRequest")({
    custom_topics: 
      S.NonEmptyString.pipe(S.NonEmptyArray, S.optional).annotations({
        documentation: "A custom topic you want the model to detect within your input audio if present. Submit up to one hundred topics."
      }),
    custom_topic_mode: 
      S.Literal("strict", "extended").pipe(S.optional).annotations({
        documentation: "When strict, the model will only return topics submitted using the custom_topic param. When extended, the model will return its own detected topics in addition to those submitted using the custom_topic param. Default: extended"
      }),
    diarize: S.Boolean.pipe(S.optional).annotations({
      description: "Recognize speaker changes. Each word in the transcript will be assigned a speaker number starting at 0. Default: false"
    }),
    diarize_version: S.NonEmptyString.pipe(S.optional).annotations({
      description: "Version of the diarization feature to use. Only used when the diarization feature is enabled"
    }),
    dictation: S.Boolean.pipe(S.optional).annotations({
      description: "Spoken dictation commands will be converted to their corresponding punctuation marks. e.g., comma to , Default: false"
    }),
    detect_entities: S.Boolean.pipe(S.optional).annotations({
      description: "Entity Detection identifies and extracts key entities from content in submitted audio. Default: false"
    }),
    detect_language: S.Boolean.pipe(S.optional).annotations({
      description: "Detect the language of the provided audio. Default: false"
    }),
    detect_topics: S.Boolean.pipe(S.optional).annotations({
      description: "Identify and extract key topics. Default: false"
    }),
    filler_words: S.Boolean.pipe(S.optional).annotations({
      description: "Whether to include words like 'uh' and 'um' in transcription output. Default: false"
    }),
  }) { }