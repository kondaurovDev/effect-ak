import { Schema as S } from "@effect/schema";
import { randomBytes, scrypt, timingSafeEqual } from "crypto"
import { Effect } from "effect";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export type HashedPassword = typeof HashedPassword.Type; 
export const HashedPassword = 
  S.TemplateLiteral(S.String, ".", S.String).pipe(S.brand("HashedPassword"))

const hashPasswordWithSalt = (
  password: string, salt: string,
) =>
  Effect.tryPromise(() =>
    scryptAsync(password, salt, 64) as Promise<Buffer>
  )

export const hashPassword = (
  password: string
) =>
  hashPasswordWithSalt(password, randomBytes(16).toString("hex"))

export const isPasswordValid = async (
  storedHashedPassword: HashedPassword,
  plainPassword: string
) => 
  Effect.Do.pipe(
    Effect.let("parts", () => storedHashedPassword.split(".")),
    Effect.let("hashedPasswordBuffer", ({ parts }) => 
      Buffer.from(parts[0], "hex")
    ),
    Effect.bind("plainPasswordBuffer", ({ parts }) => 
      hashPasswordWithSalt(plainPassword, parts[1])
    ),
    Effect.andThen(({ hashedPasswordBuffer, plainPasswordBuffer}) => 
      timingSafeEqual(hashedPasswordBuffer, plainPasswordBuffer)
    ),
    Effect.mapError(error =>
      new Error("Can't validate password", { cause: error })
    )
  )

