import { Schema as S } from "effect";

export class GenerateImageRequest 
  extends S.Class<GenerateImageRequest>("GenerateImageRequest")({
    prompt: S.NonEmptyString
  }) {}

export class GeneratedEncodedImageResponse 
  extends S.Class<GeneratedEncodedImageResponse>("GeneratedEncodedImageResponse")({
    image: S.String,
    finish_reason: S.Literal("SUCCESS", "CONTENT_FILTERED")
  }) {}