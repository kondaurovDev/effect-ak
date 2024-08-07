import { pipe, Effect, Match } from "effect";
import { Schema as S } from "@effect/schema"
import { CompletionError } from "./error.js";

export type StopReason = 
  typeof StopReason.Type

export const StopReason = 
  S.Literal(
    "end_turn",
    "max_tokens",
    "stop_sequence",
    "tool_use"
  );

export class MessageResponse
  extends S.Class<MessageResponse>("MessageResponse")({
    id: S.String,
    role: S.Literal("assistant"),
    type: S.Literal("message"),
    stop_reason: StopReason,
    model: S.String,
    content: 
      S.Array(
        S.Union(
          S.Struct({
            type: S.Literal("text"),
            text: S.String
          }),
          S.Struct({
            type: S.Literal("tool_use"),
            id: S.String,
            name: S.String,
            input: S.String
          })
        )
      )
  }) {

  get firstContent() {
    return pipe(
      Effect.fromNullable(
        this.content.at(0)
      ),
      Effect.mapError(() =>
        new CompletionError({
          message: "Content doesn't contain any values"
        })
      )
    )
  }

  get firstContentText() {
    return pipe(
      this.firstContent,
      Effect.andThen(_ =>
        pipe(
          Match.value(_),
          Match.when({ type: "text" }, (text) =>
            text.text
          ),
          Match.when({ type: "tool_use" }, (text) =>
            text.input
          ),
          Match.exhaustive
        )
      )
    )
  }

  get functionArgumets() {
    return pipe(
      this.firstContent,
      Effect.andThen(content =>
        pipe(
          Match.value(content),
          Match.when({ type: "tool_use" }, (tool) =>
            tool.input
          )
        ) 
      )
    )
  }

}
