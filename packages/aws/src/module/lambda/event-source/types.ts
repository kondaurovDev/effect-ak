import type * as Sdk from "@aws-sdk/client-lambda"

export type SdkCommonEventSourceMappingAttributes =
  Pick<
    Sdk.CreateEventSourceMappingRequest,
    "EventSourceArn" | "BatchSize" | "FunctionResponseTypes" | "Enabled" | "ScalingConfig"
  > 

