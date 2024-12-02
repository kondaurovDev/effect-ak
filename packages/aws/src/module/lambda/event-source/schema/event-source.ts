import * as S from "effect/Schema";

export type EventSourceAttributes = typeof EventSourceAttributes.Type
export const EventSourceAttributes =
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
    S.extend(EventSourceAttributes)
  );

export type StandardQueueEventSource = typeof StandardQueueEventSource.Type
export const StandardQueueEventSource =
  S.Struct({
    queueType: S.Literal("standard"),
    batchWindow: S.Number.pipe(S.greaterThanOrEqualTo(0))
  }).pipe(
    S.extend(EventSourceAttributes)
  )

export type LambdaFunctionEventSource =
  typeof LambdaFunctionEventSource.Type

export const LambdaFunctionEventSource =
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
