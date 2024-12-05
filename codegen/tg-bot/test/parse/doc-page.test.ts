import { describe, it, assert, beforeAll } from "vitest"
import { Effect, pipe } from "effect"

import { DocPage } from "#/parse/service/_export"
import { testLayer } from "../const.js";

const makeFixture =
  Effect.gen(function* () {

    const page  = yield* DocPage;

    const findNode = 
      (name: string) =>
        Effect.fromNullable(page.getTypeOrMethodNode(name)?.parentNode)

    return {
      sendChatAction: yield* findNode("sendChatAction")
    }
  });

describe("extract services", () => {

  let fixture: Effect.Effect.Success<typeof makeFixture>;

  beforeAll(async () => {
    fixture = await pipe(
      makeFixture,
      Effect.provide(testLayer),
      Effect.runPromise
    )
  })

  it("doc-page service, find siblings of send message node", async () => {

    const typeDetails = 
      DocPage.findNextClosestSibling({
        node: fixture.sendChatAction,
        oneOftags: ["table", "li"]
      });

    assert(typeDetails._tag == "Right");

    // expect(typeDetails.right).toEqual([
    //   "Use this method to send text messages",
    //   "On success, the sent Message is returned"
    // ]);

  })

})