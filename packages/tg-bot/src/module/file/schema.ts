import { Brand } from "effect"
import { Schema as S } from "@effect/schema"

export const GetFileInfoCommandInput = 
  S.Struct({
    file_id: S.String
  });

export type RemoteFilePath = Brand.Branded<string, "RemoteFilePath">
export const RemoteFilePath = Brand.nominal<RemoteFilePath>();

export type FileExtension = Brand.Branded<string, "FileExtension">
export const FileExtension = Brand.nominal<FileExtension>();

export const FileInfo =
  S.Struct({
    file_id: S.String,
    file_unique_id: S.String,
    file_size: S.Number,
    file_path: S.String
  }).annotations({
    identifier: "FileInfo"
  });
