import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { Brand } from "effect";

export type BucketName = string & Brand.Brand<"BucketName">;
export const BucketName = Brand.nominal<BucketName>();

export type BucketKey = string & Brand.Brand<"BucketKey">;
export const BucketKey = Brand.nominal<BucketKey>();

export type ObjectVersion = string & Brand.Brand<"ObjectVersion">;
export const ObjectVersion = Brand.nominal<ObjectVersion>();

export type FileContent = PutObjectCommandInput["Body"] & Brand.Brand<"FileContent">;
export const FileContent = Brand.nominal<FileContent>();