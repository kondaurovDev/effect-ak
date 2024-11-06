import * as S from "effect/Schema";

export class GenerateImageRequest 
  extends S.Class<GenerateImageRequest>("GenerateImageRequest")({
    prompt: S.NonEmptyString,
    modelEndpoint: S.TemplateLiteral("/", S.String)
  }) {}

export class GeneratedEncodedImageResponse 
  extends S.Class<GeneratedEncodedImageResponse>("GeneratedEncodedImageResponse")({
    image: S.String,
    finish_reason: S.Literal("SUCCESS", "CONTENT_FILTERED")
  }) {}
