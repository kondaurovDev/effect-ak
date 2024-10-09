import { pipe, Effect } from "effect";
import { Schema as S } from "@effect/schema"

import { CompletionError } from "../error.js";

export type FinishReason = 
  typeof FinishReason.Type

export const FinishReason = 
  S.Literal(
    "stop",
    "tool_calls",
    "length",
    "content_filter"
  );

export class ResponseChoice
  extends S.Class<ResponseChoice>("ResponseChoice")({
    finish_reason: FinishReason,
    message: 
      S.Struct({
        role: S.Literal("system", "user", "assistant"),
        content: S.NullOr(S.String),
        tool_calls: S.optional(S.Array(
          S.Struct({
            type: S.Literal("function"),
            function: S.Struct({
              arguments: S.String
            })
          })
        ))
      })
  }) {

  get functionArgumets() {
    return pipe(
      Effect.fromNullable(this.message.tool_calls?.at(0)),
      Effect.mapError(() =>
        new CompletionError({ errorCode: "MissingToolCall" })
      ),
      Effect.andThen(_ => _.function.arguments)
    )
  }

}