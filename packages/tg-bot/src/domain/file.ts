import { Schema as S } from "@effect/schema"
import { Brand } from "effect";

export type RemoteFilePath = 
  string & Brand.Brand<"RemoteFilePath">

export const RemoteFilePath =
  Brand.nominal<RemoteFilePath>();

export type FileExtension = 
  string & Brand.Brand<"FileExtension">

export const FileExtension =
  Brand.nominal<FileExtension>();

export const FileInfo =
  S.Struct({
    file_id: S.String,
    file_unique_id: S.String,
    file_size: S.Number,
    file_path: S.String
  }).annotations({
    identifier: "FileInfo"
  });
