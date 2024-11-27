import * as Effect from "effect/Effect";
import type { MetricDatum } from "@aws-sdk/client-cloudwatch";

import * as I from "../_schema/command.js";
import { AwsProjectIdConfig } from "../../../../internal/configuration.js";
import { CloudwatchClientService } from "../../client.js";

export class CloudwatchMetricPublishService extends
  Effect.Service<CloudwatchMetricPublishService>()(`CloudwatchMetricPublishService`, {
    effect:
      Effect.gen(function* () {

        const client = yield* CloudwatchClientService;
        const projectId = yield* AwsProjectIdConfig;

        const publishMetric =
          (input: {
            namespace: string,
            data: MetricDatum[]
          }) =>
            client.execute(
              "putMetricData",
              {
                Namespace: input.namespace,
                MetricData: input.data
              }
            );

        const publishProcessorMetric =
          (input: I.PublishProcessorMetric) =>
            publishMetric({
              namespace: projectId.projectId,
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
      CloudwatchClientService.Default
    ]
  }) { }

