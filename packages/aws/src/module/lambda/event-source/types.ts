import * as S from "effect/Schema";
import type * as Sdk from "@aws-sdk/client-lambda"

export type SdkCommonEventSourceMappingAttributes =
  Pick<
    Sdk.CreateEventSourceMappingRequest,
    "EventSourceArn" | "BatchSize" | "FunctionResponseTypes" | "Enabled" | "ScalingConfig"
  > 

export type QueueEventSource = typeof QueueEventSource.Type
export const QueueEventSource =
  S.Struct({
    type: S.Literal("queue"),
    active: S.Boolean,
    queueName: S.NonEmptyString,
    batchSize: S.Number,
    maximumConcurrency: S.Number,
    enablePartialResponse: S.Boolean
  })

export type FifoQueueEventSource = typeof FifoQueueEventSource.Type
export const FifoQueueEventSource =
  S.Struct({
    queueType: S.Literal("fifo"),
  }).pipe(
    S.extend(QueueEventSource)
  );

export type StandardQueueEventSource = typeof StandardQueueEventSource.Type
export const StandardQueueEventSource =
  S.Struct({
    queueType: S.Literal("standard"),
    batchWindow: S.Number.pipe(S.greaterThanOrEqualTo(0))
  }).pipe(
    S.extend(QueueEventSource)
  )

export type EventSource =
  typeof EventSource.Type

export const EventSource =
  S.Union(
    FifoQueueEventSource,
    StandardQueueEventSource,
    S.Struct({
      type: S.Literal("stream"),
      streamArn: S.NonEmptyString
    }),
  ).annotations({
    identifier: "FunctionEventSource",
    title: "EventSource",
    description: "Source of input events"
  });
