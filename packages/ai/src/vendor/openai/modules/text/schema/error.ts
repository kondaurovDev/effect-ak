import * as S from "effect/Schema";

export const MissingInputFieldsError =
  S.Struct({
    $$$error: S.String.annotations({
      description: "text with what is missing exactly, not all required fields listed"
    })
  }).annotations({
    title: "MissingInputFields",
    description: "required user information is not provided"
  })
