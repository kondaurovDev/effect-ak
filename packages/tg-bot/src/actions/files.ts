import { Effect, pipe } from "effect"
import { Schema as S } from "@effect/schema"

import { TgBotHttpClient } from "../api/index.js";
import { FileInfo } from "../domain/index.js";

export const GetFileInfoInput = 
  S.Struct({
    file_id: S.String
  });

export const getFileInfo = (
  input: typeof GetFileInfoInput.Type
) =>
  pipe(
    TgBotHttpClient,
    Effect.andThen(client =>
      client.executeMethod(
        "/getFile",
        input,
        FileInfo
      )
    )
  )
