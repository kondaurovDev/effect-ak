import { Effect, pipe, Cause } from "effect";
import { NodeTextConversionService } from "@effect-ak/misc/node";

import { KmsClientService } from "#/clients/kms.js";

export class KmsSecretService
  extends Effect.Service<KmsSecretService>()("KmsSecretService", {
    effect:
      Effect.gen(function* () {

        const kms = yield* KmsClientService;
        const text = yield* NodeTextConversionService;

        const encryptSecret = (
          secret: string,
          keyId: string
        ) =>
          pipe(
            kms.execute(
              "encrypt",
              {
                KeyId: keyId,
                Plaintext: text.stringToUint8Array(secret)
              }
            ),
            Effect.andThen(_ => _.CiphertextBlob),
            Effect.filterOrFail(
              _ => _ != null,
              () => Cause.fail("CiphertextBlob is undefined")
            )
          );

        const decryptSecret = (
          secretBase64: string,
          keyId: string
        ) =>
          pipe(
            kms.execute(
              "decrypt",
              {
                KeyId: keyId,
                CiphertextBlob: new Uint8Array(Buffer.from(secretBase64, "base64"))
              }
            ),
            Effect.andThen(_ => _.Plaintext),
            Effect.filterOrFail(
              _ => _ != null,
              () => Cause.fail("Plaintext is undefined")
            )
          )

        return {
          encryptSecret, decryptSecret
        } as const

      }),
      
      dependencies: [
        NodeTextConversionService.Default,
        KmsClientService.Default
      ]

  }) {}
