import { pipe } from "effect/Function";
import * as S from "effect/Schema";
import * as Either from "effect/Either";

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

  text() {
    return pipe(
      Either.right(this.message.content),
      Either.filterOrLeft(_ => _ != null, () => new CompletionError({ errorCode: "NoContent" }))
    )
  }

  functionArgumets() {
    return pipe(
      Either.right(this.message.tool_calls?.at(0)),
      Either.filterOrLeft(_ => _ != null, () => new CompletionError({ errorCode: "MissingToolCall" })),
      Either.andThen(_ => _.function.arguments)
    )
  }


}