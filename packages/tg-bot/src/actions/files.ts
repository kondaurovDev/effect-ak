import { Effect, pipe } from "effect"
import { Schema as S } from "@effect/schema"

import { TgRestClient } from "../client/tag.js";
import { FileInfo } from "../domain/index.js";

export const GetFileInfoInput = 
  S.Struct({
    file_id: S.String
  });

export const getFileInfo = (
  input: typeof GetFileInfoInput.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.execute(
        "/getFile",
        input,
        FileInfo
      )
    )
  )
