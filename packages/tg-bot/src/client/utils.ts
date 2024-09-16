import { Effect, Match, pipe } from "effect";
import { Schema as S } from "@effect/schema";
import { HttpBody } from "@effect/platform";

import { TgBotApiServerError } from "./error.js";

export const getFormData = (
  methodName: `/${string}`,
  body: Record<string, unknown>
) => {
  const result = new FormData();
  for (const [key, value] of Object.entries(body)) {
    pipe(
      Match.value(typeof value),
      Match.when("object",
        () => {
          if (value instanceof Uint8Array && methodName == "/sendVoice") {
            result.append(key, new Blob([value]), "file.ogg")
          } else {
            result.append(key, JSON.stringify(value))
          }
        }
      ),
      Match.orElse(() => result.append(key, value))
    )
  }
  return HttpBody.formData(result);
}

export const validateResponse = <O, O2>(
  outputSchema: S.Schema<O, O2>,
  response: unknown
) =>
  pipe(
    S.decodeUnknown(outputSchema)(response),
    Effect.mapError((parseError) => new TgBotApiServerError({ cause: parseError }))
  )