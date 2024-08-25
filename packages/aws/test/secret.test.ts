import { Effect, Layer, Logger, LogLevel, pipe } from "effect";
import { describe, expect, it } from "vitest";
import { AwsRegionLive } from "@efkit/shared";

import { ServiceLive, encryptSecret, decryptSecret } from "../src/kms"

describe("kms test suite", () => {

  const keyId = "alias/secret"

  it("encrypt secret", async () => {

    const live = 
      Layer.mergeAll(
        ServiceLive,
      ).pipe(
        Layer.provide(AwsRegionLive("eu-west-2"))
      )

    const actual = 
      await pipe(
        encryptSecret("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", keyId),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.provide(live),
        Effect.runPromise
      );

    expect(actual).not.toHaveLength(0)

  });

  it("decrypt secret", async () => {
    const encryptet = "AQICAHgEcqJguQB4lLSv7O8Lz9JJQ1O/K3XAxTFoVy24H36o9wEZ1lOyWqtbR3i8+dQDH/XsAAAAYTBfBgkqhkiG9w0BBwagUjBQAgEAMEsGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMmaNINkcWupwFC7TiAgEQgB5lroEeg8QALJSCrMZg74Llbtbs3fgWci4uIag/IiY=";
    const encrypted = "AQICAHgEcqJguQB4lLSv7O8Lz9JJQ1O/K3XAxTFoVy24H36o9wH+uZ3LfOV9hMHNC1m/IDCEAAAAeTB3BgkqhkiG9w0BBwagajBoAgEAMGMGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMtASFHPLHbk4cK3NAAgEQgDav1a+46XrQoj5L2eAomtN3p+1LIVJvyzEyw0Iw/HOBJ4kYXSMhMX/vn1vZcFXDFgj/CqGWM8E="

    const actual = 
      await pipe(
        decryptSecret(encryptet, keyId),
        Effect.provide(ServiceLive),
        Effect.provide(AwsRegionLive("eu-west-2")),
        Effect.runPromise
      );

    expect(actual).toEqual("pwd1")
    
  });

})