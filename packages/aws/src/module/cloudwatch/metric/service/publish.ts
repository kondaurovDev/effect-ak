import * as Effect from "effect/Effect";
import type { MetricDatum } from "@aws-sdk/client-cloudwatch";

import { AwsProjectIdConfig } from "#core/index.js";
import { CloudwatchClientService } from "#clients/cloudwatch.js";
import * as S from "../schema/command.js";

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
          (input: S.PublishProcessorMetric) =>
            publishMetric({
              namespace: projectId,
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

