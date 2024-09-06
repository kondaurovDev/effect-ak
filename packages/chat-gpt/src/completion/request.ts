import { Schema as S } from "@effect/schema"
import { Brand, pipe, Effect } from "effect";

import * as FunctionTool from "../tools/function-tool.js"

export type MessageContent =
  typeof MessageContent.Type

export const ImageMessageContent =
  S.Struct({
    type: S.Literal("image_url"),
    image_url: S.Struct({
      url: S.String
    })
  })

export const TextMessageContent =
  S.Struct({
    type: S.Literal("text"),
    text: S.String
  })

export const MessageContent = 
  S.Union(
    ImageMessageContent,
    TextMessageContent
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

export const RequestMessageSchema =
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

const ResponseFormat = 
  S.Union(
    S.Struct({
      type: S.Literal("text", "json_object")
    }),
    S.Struct({
      type: S.Literal("json_schema"),
      json_schema: S.Struct({
        name: S.NonEmptyString,
        description: S.NonEmptyString,
        schema: S.Unknown,
        strict: S.Boolean
      })
    })
  )

export const MissingInputFieldsError = 
  S.Struct({
    $$$error: S.String.annotations({
      description: "text with what is missing exactly, not all required fields listed"
    })
  }).annotations({
    title: "MissingInputFields",
    description: "required user information is not provided"
  })

export class ChatCompletionRequest
  extends S.Class<ChatCompletionRequest>("ChatCompletionRequest")({
    messages: S.Array(RequestMessageSchema),
    response_format: S.optional(ResponseFormat),
    model: Model,
    user: S.optional(S.String),
    max_tokens: S.optional(S.Number),
    stop: S.optional(S.String),
    temperature: S.optional(S.Number),
    tools: S.optional(S.Array(FunctionTool.ToolSchema)),
    tool_choice: S.optional(ToolChoice)
  }) {

    static createFunctionCall<F>(
      schemaName: string,
      functionSchema: S.Schema<F>,
      model: Model,
      systemMessages: string[],
      userMessage: string,
    ) {

      return pipe(
        FunctionTool.getTool(schemaName, functionSchema),
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

    static createStructuredRequest<F>(
      schemaName: string,
      functionSchema: S.Schema<F>,
      model: Model,
      systemMessages: string[],
      userMessage: string,
    ) {

      return pipe(
        Effect.all({
          successSchema: FunctionTool.getTool(schemaName, functionSchema),
          errorSchema: FunctionTool.getTool("MissingFieldsError", MissingInputFieldsError)
        }),
        Effect.andThen(({ successSchema, errorSchema }) =>
          ChatCompletionRequest.make({
            model: model,
            max_tokens: 100,
            response_format: {
              type: "json_schema",
              json_schema: {
                name: successSchema.function.name.replaceAll(" ", "_"),
                description: successSchema.function.description,
                schema: {
                  type: "object",
                  required: [ "result" ],
                  additionalProperties: false,
                  properties: {
                    result: {
                      anyOf: [
                        successSchema.function.parameters,
                        errorSchema.function.parameters
                      ]
                    }
                  }
                },
                strict: true 
              }
            },
            messages: [
              { role: "system", content: [
                ...[
                  TextMessageContent.make({ 
                    type: "text", text: "refuse to provide successful response if some required schema fields are missing"
                  }),
                  TextMessageContent.make({ 
                    type: "text", text: "in case of error response specify missing fields related to user phrase, not all required fields"
                  }),
                  
                ],
                ...(systemMessages ? systemMessages.map(msg => 
                  (TextMessageContent.make({ type: "text", text: msg }))
                ) : [])
              ] },
              { role: "user", content: userMessage }
            ]
          })
        )
      ) 
    }

  };
