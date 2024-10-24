import { pipe, Effect } from "effect";
import * as S from "effect/Schema";

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
        content: S.String.pipe(S.NullOr),
        tool_calls:
          S.Struct({
            type: S.Literal("function"),
            function: S.Struct({
              arguments: S.String
            })
          }).pipe(
            S.Array,
            S.optional
          )
      })
  }) {

  get text() {
    return pipe(
      Effect.succeed(this.message.content),
      Effect.filterOrFail(
        _ => _ != null,
        () => new CompletionError({ errorCode: "NoContent" })
      )
    )
  }

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