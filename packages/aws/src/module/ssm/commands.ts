// GENERATED CODE

import * as Sdk from "@aws-sdk/client-ssm";
import assert from "assert";

const exceptionNames = [
  "ASD", "VSSD"
] as const;

export type SsmExceptionName = typeof exceptionNames[number];

interface SsmClientApi {
  addTagsToResource: (_: Sdk.AddTagsToResourceCommandInput) => Sdk.AddTagsToResourceCommandOutput
  put: (_: Sdk.PutParameterCommandInput) => Sdk.PutParameterCommandOutput
}

const SsmCommandFactory = {
  addTagsToResource: (_: Sdk.AddTagsToResourceCommandInput) => new Sdk.AddTagsToResourceCommand(_)
} as Record<keyof SsmClientApi, (_: unknown) => unknown>

