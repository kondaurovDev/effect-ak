import { pipe, Effect } from "effect";
import { Schema as S } from "@effect/schema"

import { CompletionError } from "../error.js";
import { ResponseChoice } from "./response-choice.js";

export class ChatCompletionResponse
  extends S.Class<ChatCompletionResponse>("ChatCompletionResponse")({
    choices: S.Array(ResponseChoice),
    model: S.NonEmptyString,
    usage: 
      S.Struct({
        completion_tokens: S.Number,
        prompt_tokens: S.Number,
        total_tokens: S.Number
      })
  }) {

  get firstChoice() {
    return pipe(
      Effect.fromNullable(this.choices.at(0)),
      Effect.mapError(() =>
        new CompletionError({ errorCode: "MissingChoices" })
      )
    )
  }

  get messageCost() {
    return 0;
  }

};
