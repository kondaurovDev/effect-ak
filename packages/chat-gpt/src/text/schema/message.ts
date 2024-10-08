import { pipe } from "effect";
import { Schema as S } from "@effect/schema"

import { MessageContent } from "./message-content.js";

export class ToolRoleMessage extends
  S.Class<ToolRoleMessage>("ToolMessage")({
    role: S.Literal("tool"),
    content: MessageContent,
    tool_call_id: S.String
  }) { }

export class CommonUserOrAssistantMessageFields
  extends S.Class<CommonUserOrAssistantMessageFields>("UserOrSystemMessageFields")({

  }) { }

export class UserMessage
  extends S.Class<UserMessage>("UserMessage")({
    role: S.Literal("user"),
    content: MessageContent,
    name: S.String.pipe(S.optional)
  }) { }

export class SystemMessage
  extends S.Class<SystemMessage>("SystemMessage")({
    role: S.Literal("system"),
    content: MessageContent,
    name: S.String.pipe(S.optional)
  }) { }

export class AssistantMessage
  extends S.Class<AssistantMessage>("AssistantMessage")({
    role: S.Literal("assistant"),
    content: MessageContent,
    name: S.String.pipe(S.optional),
    tool_calls:
      pipe(
        S.Struct({
          type: S.Literal("function"),
          function:
            S.Struct({
              arguments: S.String
            })
        }),
        S.Array,
        S.optional
      )
  }) { }

export const OneOfMessage =
  S.Union(
    ToolRoleMessage,
    UserMessage,
    AssistantMessage,
    SystemMessage
  );
