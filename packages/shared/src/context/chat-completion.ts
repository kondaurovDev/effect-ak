import { Tag } from "effect/Context"

export class ChatCompletionService
  extends Tag("ChatCompletionService")<ChatCompletionService, {
    complete(_: { 
      systemMessage: string, 
      userMessage: string
    }): Promise<string>
  }>() { }
