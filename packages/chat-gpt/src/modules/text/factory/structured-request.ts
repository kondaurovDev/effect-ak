import { pipe, Effect } from "effect";
import * as S from "effect/Schema";

import { GptModelName } from "../schema/model-name.js";
import { TextMessageContent } from "../schema/message-content.js";
import { makeFunctionTool } from "./function-tool.js";
import { ChatCompletionRequest } from "../schema/request.js";
import { MissingInputFieldsError } from "../schema/error.js";
import { SystemMessage, UserMessage } from "../schema/message.js";
import { StructuredResponseFormat } from "../schema/response-format.js";

export const makeStructuredRequest = <F>(
  schemaName: string,
  functionSchema: S.Schema<F>,
  model: GptModelName,
  systemMessages: string[],
  userMessage: string,
) =>
  pipe(
    Effect.all({
      successSchema: makeFunctionTool(schemaName, functionSchema),
      errorSchema: makeFunctionTool("MissingFieldsError", MissingInputFieldsError)
    }),
    Effect.andThen(({ successSchema, errorSchema }) =>
      ChatCompletionRequest.make({
        model: model,
        max_tokens: 100,
        response_format:
          StructuredResponseFormat.make({
            type: "json_schema",
            json_schema: {
              name: successSchema.function.name.replaceAll(" ", "_"),
              description: successSchema.function.description,
              schema: {
                type: "object",
                required: ["result"],
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
          }),
        messages: [
          SystemMessage.make({
            role: "system",
            content: [
              ...(systemMessages ? systemMessages.map(msg =>
                TextMessageContent.make({ type: "text", text: msg })
              ) : [])
            ]
          }),
          UserMessage.make({ role: "user", content: userMessage })
        ]
      })
    )
  )