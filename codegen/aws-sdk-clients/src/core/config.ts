import { Schema as S, Context } from "effect";

export class GenerateConfigTag 
  extends Context.Tag("GenerateConfigTag")<GenerateConfigTag, GenerateConfig>() {}

export class GenerateConfig
  extends S.Class<GenerateConfig>("GenerateConfig")(
    S.Struct({
      target_dir: S.NonEmptyString.pipe(S.NonEmptyArray),
      clients: S.NonEmptyString.pipe(S.Array, S.optional),
    })
  ) { }
