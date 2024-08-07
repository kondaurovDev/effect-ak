import { describe, it, expect } from "vitest";
import { Effect, pipe } from "effect";

import { GMTByTimezoneNameCache, timestampToPrettyDateTime } from "../src/date";

describe("date test suite", () => {
  it("get yerevan's GMT", () => {
    const result = 
      pipe(
        GMTByTimezoneNameCache.get("asia/yerevan"),
        Effect.runSync
      )
    
    expect(result).toEqual("GMT+04:00")
  })

  it("timestamp to pretty", () => {
    const result = 
      pipe(
        timestampToPrettyDateTime(1721296163 * 1000, "asia/yerevan"),
        Effect.runSync
      );
    
    expect(result).toBeDefined()
  })

})