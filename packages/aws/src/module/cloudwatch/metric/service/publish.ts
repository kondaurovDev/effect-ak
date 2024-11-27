import * as Effect from "effect/Effect";
import type { MetricDatum } from "@aws-sdk/client-cloudwatch";

import { GlobalContextTag } from "../../../../internal/global-context.js";
import { CloudwatchClient } from "../../client.js";
import * as I from "../_schema/command.js";

export class CloudwatchMetricPublishService extends
  Effect.Service<CloudwatchMetricPublishService>()(`CloudwatchMetricPublishService`, {
    effect:
      Effect.gen(function* () {

        const client = yield* CloudwatchClient;
        const ctx = yield* GlobalContextTag;

        const publishMetric =
          (input: {
            namespace: string,
            data: MetricDatum[]
          }) =>
            client.execute(
              `put metric data into ${input.namespace}`,
              _ =>
                _.putMetricData({
                  Namespace: input.namespace,
                  MetricData: input.data
                })
            );

        const publishProcessorMetric =
          (input: I.PublishProcessorMetric) =>
            publishMetric({
              namespace: ctx.projectId,
              data: [
                {
                  MetricName: input.metricName,
                  Dimensions: [
                    {
                      Name: "Processor",
                      Value: `${input.processorName}-processor`
                    }
                  ],
                  Value: input.value,
                  Unit: "Count"
                }
              ]
            });

        return {
          publishProcessorMetric
        } as const;

      }),

    dependencies: [
      CloudwatchClient.Default
    ]
  }) { }

