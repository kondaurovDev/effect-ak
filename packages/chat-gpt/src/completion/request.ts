import { Schema as S } from "@effect/schema"
import { Brand, pipe, Effect } from "effect";

import * as FunctionTool from "../tools/function-tool"

export type MessageContent =
  typeof MessageContent.Type

export const MessageContent = 
  S.Union(
    S.Struct({
      type: S.Literal("image_url"),
      image_url: S.Struct({
        url: S.String
      })
    }),
    S.Struct({
      type: S.Literal("text"),
      text: S.String
    }),
  );

const Content =
  S.Union(
    S.String,
    S.Array(MessageContent)
  )

export type Model = typeof Model.Type
export const Model = S.NonEmptyString

export type RequestMessage = 
  typeof RequestMessageSchema.Type & Brand.Brand<"RequestMessage">;
export const RequestMessage = Brand.nominal<RequestMessage>();

const RequestMessageSchema =
  S.Union(
    S.Struct({
      role: S.Literal("tool"),
      content: Content,
      tool_call_id: S.String
    }),
    S.Struct({
      role: S.Literal("system", "user"),
      content: Content,
      name: S.optional(S.String)
    }),
    S.Struct({
      role: S.Literal("assistant"),
      content: Content,
      name: S.optional(S.String),
      tool_calls: S.optional(S.Array(
        S.Struct({
          type: S.Literal("function"),
          function: S.Struct({
            arguments: S.String
          })
        })
      ))
    })
  );

export type ToolChoice =
  typeof ToolChoice.Type;

export const ToolChoice = 
  S.Union(
    S.Literal("none"),
    S.Literal("auto"),
    S.Struct({
      type: S.Literal("function"),
      function: S.Struct({
        name: S.String
      })
    }),
  );

export class ChatCompletionRequest
  extends S.Class<ChatCompletionRequest>("ChatCompletionRequest")({
    messages: S.Array(RequestMessageSchema),
    response_format: 
      S.optional(
        S.Struct({
          type: S.Literal("text", "json_object")
        })
      ),
    model: Model,
    user: S.optional(S.String),
    max_tokens: S.optional(S.Number),
    stop: S.optional(S.String),
    temperature: S.optional(S.Number),
    tools: S.optional(S.Array(FunctionTool.ToolSchema)),
    tool_choice: S.optional(ToolChoice)
  }) {

    static createFunctionCall<F>(
      functionSchema: S.Schema<F>,
      model: Model,
      systemMessages: string[],
      userMessage: string,
    ) {

      return pipe(
        FunctionTool.getTool(functionSchema),
        Effect.andThen(tool =>
          ChatCompletionRequest.make({
            model: model,
            max_tokens: 100,
            tools: [ tool ],
            tool_choice: FunctionTool.getToolChoice(tool.function.name),
            messages: [
              { role: "system", content: [
                ...(systemMessages ? systemMessages.map(msg => 
                  ({ type: "text", text: msg } as MessageContent)
                ) : [])
              ] },
              { role: "user", content: userMessage }
            ]
          })
        )
      ) 
    }

  };
