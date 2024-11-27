import * as Data from "effect/Data"
import * as S from "effect/Schema"

export const BuildSourceCodeInput = 
  S.Struct({
    inputFilePath: S.NonEmptyArray(S.NonEmptyString),
    external: S.Array(S.NonEmptyString).pipe(S.optional),
    minify: S.Boolean
  });

export class HashedPassword
  extends Data.Class<{
    password: Buffer,
    salt: Buffer
  }> {}
