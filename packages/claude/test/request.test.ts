import { describe, it, expect } from "vitest";
import { Schema as S, } from "@effect/schema"
import { Effect, Logger, pipe } from "effect";

import { Message, MessageContent } from "../src/completion"

describe("request", () => {

  it("parse bad", () => {

    const actual = 
      pipe(
        S.validate(MessageContent)({
          type: "image",
          source: {
            type: "base64",
            media_type: "asd",
            data: "very long"
          }
        }),
        Effect.andThen(obj =>
          Effect.logInfo("message", obj)
        ),
        Effect.provide(
          Logger.json,
        ),
        Effect.runSync
      )

    expect(actual).toBeUndefined()

  })

})