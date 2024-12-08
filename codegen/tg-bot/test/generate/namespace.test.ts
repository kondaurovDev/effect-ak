import { describe, it, assert } from "vitest";
import { Effect } from "effect";

import { generateNamespace } from "#/generate/namespace";
import { PageProvider } from "#/service/page-provider";
import { WriteCodeService } from "#/service/write-code";
import { withConfig } from "#/layer";

describe("write services", () => {

  it("generate namespace ", async () => {

    const program =
      await Effect.gen(function* () {

        yield* generateNamespace("primary");

      }).pipe(
        Effect.provide([
          PageProvider.Default,
          WriteCodeService.Default
        ]),
        Effect.withConfigProvider(
          withConfig({
            pagePath: "tg-bot-api.html"
          })
        ),
        Effect.tapErrorCause(Effect.logError),
        Effect.runPromiseExit
      );

    assert(program._tag == "Success")

  })

});
