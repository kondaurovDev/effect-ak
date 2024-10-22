import { Context } from "effect"

export interface ChatCompletionServiceInterface {
  complete(_: { 
    systemMessage: string, 
    userMessage: string
  }): Promise<string>
}

export class ChatCompletionService
  extends Context.Tag("ChatCompletionService")<ChatCompletionService, ChatCompletionServiceInterface>() { }
