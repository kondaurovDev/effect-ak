import { Tag } from "effect/Context"
import * as S from "effect/Schema"

export const GenerativeModelName =
  S.Struct({
    provider: S.Literal("openai", "anthropik"),
    modelName: S.NonEmptyString.pipe(S.optional)
  })

export class ChatCompletionService
  extends Tag("ChatCompletionService")<ChatCompletionService, {
    complete(
      _: {
        model: typeof GenerativeModelName.Type,
        systemMessage: string,
        userMessage: string
      }
    ): Promise<string>
  }>() { }
