import { describe, it, expect } from "vitest"
import {Effect, pipe} from "effect";

import {prepareReply, toJsonString, JsonReplacerOmitUnderscore, JsonString} from "../src/json";

describe("json test suite", () => {

  it("prepareReply", () => {
    // expect(prepareReply("foo   bar")).toEqual("foo bar");
    expect(prepareReply(`
      multi string
      another string
    `)).toEqual("multi string\nanother string");
  });

  it("toJson", async () => {

    const actual = 
      pipe(
        toJsonString(
          {
            prop1: "hey", _prop2: false
          }, JsonReplacerOmitUnderscore
        ),
        Effect.runSync
      )

    expect(JSON.parse(actual)).toEqual({ prop1: "hey" });
  });

})
