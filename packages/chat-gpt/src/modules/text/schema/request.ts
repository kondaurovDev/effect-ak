import * as S from "effect/Schema";

import { OneOfMessage, AssistantMessage, UserMessage } from "./message.js";
import { GptModelName, ReasoningModelName } from "./model-name.js";
import { OneOfTool, ToolChoice } from "./tool.js";
import { OneOfResponseFormat } from "./response-format.js";

export class ChatCompletionRequest
  extends S.Class<ChatCompletionRequest>("ChatCompletionRequest")({
    messages: OneOfMessage.pipe(S.Array),
    response_format: S.suspend(() => OneOfResponseFormat).pipe(S.optional),
    model: GptModelName,
    user: S.String.pipe(S.optional),
    max_tokens: S.Number.pipe(S.optional),
    stop: S.String.pipe(S.optional),
    temperature: S.Number.pipe(S.optional),
    tools: S.Array(OneOfTool).pipe(S.optional),
    tool_choice: S.suspend(() => ToolChoice).pipe(S.optional),
  }) { };

export class ReasoningRequest
  extends S.Class<ReasoningRequest>("ReasoningRequest")({
    messages: S.Union(AssistantMessage, UserMessage).pipe(S.Array),
    model: ReasoningModelName,
    user: S.String.pipe(S.optional),
    max_tokens: S.Number.pipe(S.optional),
    stop: S.String.pipe(S.optional),
    temperature: S.Number.pipe(S.optional),
  }) { };

export type OneOfRequest = typeof OneOfRequest.Type
export const OneOfRequest = 
  S.Union(
    ChatCompletionRequest,
    ReasoningRequest
  )

// export class GetStructuredByReasoningModelRequest
//   extends S.Class<GetStructuredByReasoningModelRequest>("GetStructuredByReasoningModelRequest")({
//     instructions: S.
//   }) { };