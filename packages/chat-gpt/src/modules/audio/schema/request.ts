import { HttpBody } from "@effect/platform";
import { Schema as S } from "@effect/schema";

export class CreateSpeechRequest 
  extends S.Class<CreateSpeechRequest>("CreateSpeechRequest")({
    model: S.Literal("tts-1", "tts-1-hd"),
    input: S.NonEmptyString.pipe(S.maxLength(4096)),
    voice: S.Literal("alloy", "echo", "fable", "onyx", "nova", "shimmer"),
    response_format: S.Literal("mp3", "opus", "aac", "flac", "wav", "pcm"),
    speed: S.Number.pipe(S.greaterThanOrEqualTo(0.25), S.lessThanOrEqualTo(4))
  }) {}


export type SupportedInputAudioFileExtension = typeof SupportedInputAudioFileExtension.Type
const SupportedInputAudioFileExtension = 
  S.Literal("flac", "mp3", "mp4", "mpeg", "mpga", "m4a", "ogg", "wav", "webm")

export class TranscribeRequest 
  extends S.Class<TranscribeRequest>("TranscribeRequest")({
    model: S.Literal("whisper-1"),
    fileName: S.String,
    fileContent: S.Uint8Array,
    response_format: S.Literal("json", "text", "srt", "verbose_json", "vtt"),
    language: S.NonEmptyString.pipe(S.optional),
    prompt: S.NonEmptyString.pipe(S.optional)
  }) {
  
    getHttpBody() {
      const formData = new global.FormData();
      formData.append("model", this.model);
      formData.append("response_format", this.response_format);
      if (this.language) {
        formData.append("language", this.language)
      }
      formData.append("file", this.fileContent, this.fileName);
      return HttpBody.formData(formData);
    }

  }
