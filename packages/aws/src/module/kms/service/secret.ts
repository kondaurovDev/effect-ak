import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as Cause from "effect/Cause";

import { KmsClientService } from "../client.js";
import { NodeTextConversionService } from "packages/misc/dist/node/index.js";

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
