import { Schema as S } from "@effect/schema";
import { randomBytes, scrypt, timingSafeEqual } from "crypto"
import { Effect, pipe } from "effect";

export type HashedPassword = typeof HashedPassword.Type; 
export const HashedPassword = 
  S.TemplateLiteral(S.String, S.Literal("."), S.String).pipe(S.brand("HashedPassword"))

const hashPasswordWithSalt = (
  password: string, salt: Buffer,
) =>
  Effect.async<Buffer, Error>((resume) =>
    scrypt(password, salt.toString("hex"), 64, (error, data) => {
      if (error) {
        resume(Effect.fail(error))
      } else {
        resume(Effect.succeed(data))
      }
    })
  ).pipe(
    Effect.andThen(result => 
      HashedPassword.make(`${result.toString("base64")}.${salt.toString("base64")}`)
    )
  )

export const hashPassword = (
  password: string
) =>
  hashPasswordWithSalt(password, randomBytes(16))

export const isPasswordValid = (
  storedHashedPassword: HashedPassword,
  plainPassword: string
) => 
  pipe(
    Effect.Do,
    Effect.let("parts", () => storedHashedPassword.split(".")),
    Effect.let("hashedPasswordBuffer", ({ parts }) => 
      Buffer.from(parts[0], "base64")
    ),
    Effect.bind("plainPasswordBuffer", ({ parts }) => 
      hashPasswordWithSalt(plainPassword, Buffer.from(parts[1], "base64"))
    ),
    Effect.andThen(({ hashedPasswordBuffer, plainPasswordBuffer}) => 
      timingSafeEqual(hashedPasswordBuffer, Buffer.from(plainPasswordBuffer, "base64"))
    ),
    Effect.mapError(error =>
      new Error("Can't validate password", { cause: error })
    )
  )

