import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";

import { UtilError } from "../../utils/error.js";
import { miscPackageName } from "../../const.js";
import { HashedPassword } from "../types.js";

export class NodePasswordService
  extends Effect.Service<NodePasswordService>()(`${miscPackageName}/NodePasswordService`, {
    effect:
      Effect.gen(function* () {

        const { randomBytes, scrypt, timingSafeEqual } = 
          yield* Effect.tryPromise(() => import("node:crypto"));

        yield* Effect.logDebug("NodePasswordService is ready");

        const hashPasswordWithSalt =
          (password: string, salt: Buffer) =>
            Effect.async<Buffer, UtilError>((resume) =>
              scrypt(password, salt.toString("hex"), 64, (error, data) => {
                if (error) {
                  resume(new UtilError({ name: "password", "details": "can not salt password", cause: error }))
                } else {
                  resume(Effect.succeed(data))
                }
              })
            ).pipe(
              Effect.andThen(result =>
                new HashedPassword({
                  password: result,
                  salt: salt
                })
              )
            );

        const hashPassword = (
          password: string
        ) =>
          hashPasswordWithSalt(password, randomBytes(16));

        const isPasswordValid = (
          hashedPassword: HashedPassword,
          plainPassword: Redacted.Redacted<string>
        ) =>
          Effect.gen(function*() {

            const hashedPasswordBytes = new Uint8Array(hashedPassword.password);

            const plainHashedPassword =
              yield* hashPasswordWithSalt(Redacted.value(plainPassword), hashedPassword.salt);

            const typed = new Uint8Array(plainHashedPassword.password);

            const isEqual = 
              timingSafeEqual(hashedPasswordBytes, typed);

            return isEqual;

          }).pipe(
            Effect.mapError(error =>
              new UtilError({ name: "password", details: "Can't validate password", cause: error })
            )
          )
          

        return {
          isPasswordValid, hashPassword
        } as const;

      })
  }) { }
