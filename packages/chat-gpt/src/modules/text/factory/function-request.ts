import * as S from "effect/Schema";
import { Effect, pipe } from "effect";

import { makeFunctionTool, makeToolChoice } from "./function-tool.js";
import { GptModelName } from "../schema/model-name.js";
import { ChatCompletionRequest } from "../schema/request.js";
import { TextMessageContent } from "../schema/message-content.js";
import { SystemMessage, UserMessage } from "../schema/message.js";

export const makeFunctionCallRequest = <F>(
  schemaName: string,
  functionSchema: S.Schema<F>,
  model: GptModelName,
  systemMessages: string[],
  userMessage: string,
) =>
  pipe(
    makeFunctionTool(schemaName, functionSchema),
    Effect.andThen(tool =>
      ChatCompletionRequest.make({
        model: model,
        max_tokens: 100,
        tools: [tool],
        tool_choice: makeToolChoice(tool.function.name),
        messages: [
          SystemMessage.make({
            role: "system",
            content: [
              ...(systemMessages ? systemMessages.map(msg =>
                TextMessageContent.make({ type: "text", text: msg })
              ) : [])
            ]
          }),
          UserMessage.make({
            role: "user",
            content: userMessage
          })
        ]
      })
    )
  )