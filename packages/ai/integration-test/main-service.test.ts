import { describe, it, expect } from "vitest";
import { Effect, Layer, Logger, Exit, LogLevel, ManagedRuntime } from "effect";
import { AiMainService } from "../src/public";

const runtime = 
  ManagedRuntime.make(
    Layer.mergeAll(
      AiMainService.Default
    )
  )

const program = <O>(
  inner: (_: AiMainService) => Effect.Effect<O, unknown>
) =>
  Effect.gen(function* () {

    const mainService = yield* AiMainService;

    return yield* inner(mainService)

  }).pipe(
    Logger.withMinimumLogLevel(LogLevel.Debug),
    Effect.provide(runtime),
    Effect.runPromiseExit
  )

describe("main ai service", () => {

  it("check openai, gpt4o", async () => {

    const result = 
      await program(_ =>
        _.openai.completeChat({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "give plain answer without any words"
            },
            {
              role: "user",
              content: "2 + 14 = ?"
            }
          ],
        })
      );

    expect(result).toEqual(Exit.succeed("16"));

  });

  it("check anthropik, sonnet", async () => {

    const result = 
      await program(_ =>
        _.anthropik.completeChat({
          model: "claude-3-5-sonnet-20241022",
          system: "give plain answer without any words",
          max_tokens: 10,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "2 + 14 = ?" }
              ]
            }
          ],
        }).pipe(
          Effect.andThen(_ => _.content),
        )
      );

    expect(result).toEqual(Exit.succeed("16"));

  });

})