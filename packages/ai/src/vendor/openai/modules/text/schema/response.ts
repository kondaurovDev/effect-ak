import * as Either from "effect/Either";
import * as S from "effect/Schema";

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

  firstChoice() {
    return Either.fromNullable(this.choices.at(0), () => new CompletionError({ errorCode: "MissingChoices" }));
  }

};
