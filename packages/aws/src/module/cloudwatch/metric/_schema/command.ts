import * as S from "effect/Schema"

export type PublishProcessorMetric = typeof PublishProcessorMetricSchema.Type;
export const PublishProcessorMetricSchema =
  S.Struct({
    processorName: S.NonEmptyString,
    metricName: S.NonEmptyString,
    value: S.Positive
  })
