import * as Sdk from "@aws-sdk/client-cloudwatch";
import { Effect, Data, pipe, Cause } from "effect";
import { AwsRegionConfig } from "../../internal/index.js";

// *****  GENERATED CODE *****
export class CloudwatchClientService extends
  Effect.Service<CloudwatchClientService>()("CloudwatchClientService", {
    scoped: Effect.gen(function*() {
      const region = yield* AwsRegionConfig;

      yield* Effect.logDebug("Creating aws client", { client: "Cloudwatch" });

      const client = new Sdk.CloudWatchClient({ region });

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "Cloudwatch" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof CloudwatchClientApi>(
        name: M,
        input: Parameters<CloudwatchClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(CloudwatchCommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, `Command "${name}" is unknown`),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<CloudwatchClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.CloudWatchServiceException ?
              new CloudwatchClientException({
                name: error.cause.name as CloudwatchExceptionName,
                cause: error.cause,
              }) : new Cause.UnknownException(error)
          ),
          Effect.catchTag("UnknownException", Effect.die)
        );

      return { execute };
    }),
  })
{
}

export type CloudwatchMethodInput<M extends keyof CloudwatchClientApi> = Parameters<CloudwatchClientApi[M]>[0];

export interface CloudwatchClientApi {
  deleteAlarms(_: Sdk.DeleteAlarmsCommandInput): Sdk.DeleteAlarmsCommandOutput;
  deleteAnomalyDetector(_: Sdk.DeleteAnomalyDetectorCommandInput): Sdk.DeleteAnomalyDetectorCommandOutput;
  deleteDashboards(_: Sdk.DeleteDashboardsCommandInput): Sdk.DeleteDashboardsCommandOutput;
  deleteInsightRules(_: Sdk.DeleteInsightRulesCommandInput): Sdk.DeleteInsightRulesCommandOutput;
  deleteMetricStream(_: Sdk.DeleteMetricStreamCommandInput): Sdk.DeleteMetricStreamCommandOutput;
  describeAlarmHistory(_: Sdk.DescribeAlarmHistoryCommandInput): Sdk.DescribeAlarmHistoryCommandOutput;
  describeAlarms(_: Sdk.DescribeAlarmsCommandInput): Sdk.DescribeAlarmsCommandOutput;
  describeAlarmsForMetric(_: Sdk.DescribeAlarmsForMetricCommandInput): Sdk.DescribeAlarmsForMetricCommandOutput;
  describeAnomalyDetectors(_: Sdk.DescribeAnomalyDetectorsCommandInput): Sdk.DescribeAnomalyDetectorsCommandOutput;
  describeInsightRules(_: Sdk.DescribeInsightRulesCommandInput): Sdk.DescribeInsightRulesCommandOutput;
  disableAlarmActions(_: Sdk.DisableAlarmActionsCommandInput): Sdk.DisableAlarmActionsCommandOutput;
  disableInsightRules(_: Sdk.DisableInsightRulesCommandInput): Sdk.DisableInsightRulesCommandOutput;
  enableAlarmActions(_: Sdk.EnableAlarmActionsCommandInput): Sdk.EnableAlarmActionsCommandOutput;
  enableInsightRules(_: Sdk.EnableInsightRulesCommandInput): Sdk.EnableInsightRulesCommandOutput;
  getDashboard(_: Sdk.GetDashboardCommandInput): Sdk.GetDashboardCommandOutput;
  getInsightRuleReport(_: Sdk.GetInsightRuleReportCommandInput): Sdk.GetInsightRuleReportCommandOutput;
  getMetricData(_: Sdk.GetMetricDataCommandInput): Sdk.GetMetricDataCommandOutput;
  getMetricStatistics(_: Sdk.GetMetricStatisticsCommandInput): Sdk.GetMetricStatisticsCommandOutput;
  getMetricStream(_: Sdk.GetMetricStreamCommandInput): Sdk.GetMetricStreamCommandOutput;
  getMetricWidgetImage(_: Sdk.GetMetricWidgetImageCommandInput): Sdk.GetMetricWidgetImageCommandOutput;
  listDashboards(_: Sdk.ListDashboardsCommandInput): Sdk.ListDashboardsCommandOutput;
  listManagedInsightRules(_: Sdk.ListManagedInsightRulesCommandInput): Sdk.ListManagedInsightRulesCommandOutput;
  listMetrics(_: Sdk.ListMetricsCommandInput): Sdk.ListMetricsCommandOutput;
  listMetricStreams(_: Sdk.ListMetricStreamsCommandInput): Sdk.ListMetricStreamsCommandOutput;
  listTagsForResource(_: Sdk.ListTagsForResourceCommandInput): Sdk.ListTagsForResourceCommandOutput;
  putAnomalyDetector(_: Sdk.PutAnomalyDetectorCommandInput): Sdk.PutAnomalyDetectorCommandOutput;
  putCompositeAlarm(_: Sdk.PutCompositeAlarmCommandInput): Sdk.PutCompositeAlarmCommandOutput;
  putDashboard(_: Sdk.PutDashboardCommandInput): Sdk.PutDashboardCommandOutput;
  putInsightRule(_: Sdk.PutInsightRuleCommandInput): Sdk.PutInsightRuleCommandOutput;
  putManagedInsightRules(_: Sdk.PutManagedInsightRulesCommandInput): Sdk.PutManagedInsightRulesCommandOutput;
  putMetricAlarm(_: Sdk.PutMetricAlarmCommandInput): Sdk.PutMetricAlarmCommandOutput;
  putMetricData(_: Sdk.PutMetricDataCommandInput): Sdk.PutMetricDataCommandOutput;
  putMetricStream(_: Sdk.PutMetricStreamCommandInput): Sdk.PutMetricStreamCommandOutput;
  setAlarmState(_: Sdk.SetAlarmStateCommandInput): Sdk.SetAlarmStateCommandOutput;
  startMetricStreams(_: Sdk.StartMetricStreamsCommandInput): Sdk.StartMetricStreamsCommandOutput;
  stopMetricStreams(_: Sdk.StopMetricStreamsCommandInput): Sdk.StopMetricStreamsCommandOutput;
  tagResource(_: Sdk.TagResourceCommandInput): Sdk.TagResourceCommandOutput;
  untagResource(_: Sdk.UntagResourceCommandInput): Sdk.UntagResourceCommandOutput;
}


const CloudwatchCommandFactory = {
  deleteAlarms: (_: Sdk.DeleteAlarmsCommandInput) => new Sdk.DeleteAlarmsCommand(_),
  deleteAnomalyDetector: (_: Sdk.DeleteAnomalyDetectorCommandInput) => new Sdk.DeleteAnomalyDetectorCommand(_),
  deleteDashboards: (_: Sdk.DeleteDashboardsCommandInput) => new Sdk.DeleteDashboardsCommand(_),
  deleteInsightRules: (_: Sdk.DeleteInsightRulesCommandInput) => new Sdk.DeleteInsightRulesCommand(_),
  deleteMetricStream: (_: Sdk.DeleteMetricStreamCommandInput) => new Sdk.DeleteMetricStreamCommand(_),
  describeAlarmHistory: (_: Sdk.DescribeAlarmHistoryCommandInput) => new Sdk.DescribeAlarmHistoryCommand(_),
  describeAlarms: (_: Sdk.DescribeAlarmsCommandInput) => new Sdk.DescribeAlarmsCommand(_),
  describeAlarmsForMetric: (_: Sdk.DescribeAlarmsForMetricCommandInput) => new Sdk.DescribeAlarmsForMetricCommand(_),
  describeAnomalyDetectors: (_: Sdk.DescribeAnomalyDetectorsCommandInput) => new Sdk.DescribeAnomalyDetectorsCommand(_),
  describeInsightRules: (_: Sdk.DescribeInsightRulesCommandInput) => new Sdk.DescribeInsightRulesCommand(_),
  disableAlarmActions: (_: Sdk.DisableAlarmActionsCommandInput) => new Sdk.DisableAlarmActionsCommand(_),
  disableInsightRules: (_: Sdk.DisableInsightRulesCommandInput) => new Sdk.DisableInsightRulesCommand(_),
  enableAlarmActions: (_: Sdk.EnableAlarmActionsCommandInput) => new Sdk.EnableAlarmActionsCommand(_),
  enableInsightRules: (_: Sdk.EnableInsightRulesCommandInput) => new Sdk.EnableInsightRulesCommand(_),
  getDashboard: (_: Sdk.GetDashboardCommandInput) => new Sdk.GetDashboardCommand(_),
  getInsightRuleReport: (_: Sdk.GetInsightRuleReportCommandInput) => new Sdk.GetInsightRuleReportCommand(_),
  getMetricData: (_: Sdk.GetMetricDataCommandInput) => new Sdk.GetMetricDataCommand(_),
  getMetricStatistics: (_: Sdk.GetMetricStatisticsCommandInput) => new Sdk.GetMetricStatisticsCommand(_),
  getMetricStream: (_: Sdk.GetMetricStreamCommandInput) => new Sdk.GetMetricStreamCommand(_),
  getMetricWidgetImage: (_: Sdk.GetMetricWidgetImageCommandInput) => new Sdk.GetMetricWidgetImageCommand(_),
  listDashboards: (_: Sdk.ListDashboardsCommandInput) => new Sdk.ListDashboardsCommand(_),
  listManagedInsightRules: (_: Sdk.ListManagedInsightRulesCommandInput) => new Sdk.ListManagedInsightRulesCommand(_),
  listMetrics: (_: Sdk.ListMetricsCommandInput) => new Sdk.ListMetricsCommand(_),
  listMetricStreams: (_: Sdk.ListMetricStreamsCommandInput) => new Sdk.ListMetricStreamsCommand(_),
  listTagsForResource: (_: Sdk.ListTagsForResourceCommandInput) => new Sdk.ListTagsForResourceCommand(_),
  putAnomalyDetector: (_: Sdk.PutAnomalyDetectorCommandInput) => new Sdk.PutAnomalyDetectorCommand(_),
  putCompositeAlarm: (_: Sdk.PutCompositeAlarmCommandInput) => new Sdk.PutCompositeAlarmCommand(_),
  putDashboard: (_: Sdk.PutDashboardCommandInput) => new Sdk.PutDashboardCommand(_),
  putInsightRule: (_: Sdk.PutInsightRuleCommandInput) => new Sdk.PutInsightRuleCommand(_),
  putManagedInsightRules: (_: Sdk.PutManagedInsightRulesCommandInput) => new Sdk.PutManagedInsightRulesCommand(_),
  putMetricAlarm: (_: Sdk.PutMetricAlarmCommandInput) => new Sdk.PutMetricAlarmCommand(_),
  putMetricData: (_: Sdk.PutMetricDataCommandInput) => new Sdk.PutMetricDataCommand(_),
  putMetricStream: (_: Sdk.PutMetricStreamCommandInput) => new Sdk.PutMetricStreamCommand(_),
  setAlarmState: (_: Sdk.SetAlarmStateCommandInput) => new Sdk.SetAlarmStateCommand(_),
  startMetricStreams: (_: Sdk.StartMetricStreamsCommandInput) => new Sdk.StartMetricStreamsCommand(_),
  stopMetricStreams: (_: Sdk.StopMetricStreamsCommandInput) => new Sdk.StopMetricStreamsCommand(_),
  tagResource: (_: Sdk.TagResourceCommandInput) => new Sdk.TagResourceCommand(_),
  untagResource: (_: Sdk.UntagResourceCommandInput) => new Sdk.UntagResourceCommand(_),
} as Record<keyof CloudwatchClientApi, (_: unknown) => unknown>


const CloudwatchExceptionNames = [
  "CloudWatchServiceException", "ConcurrentModificationException", "DashboardInvalidInputError",
  "DashboardNotFoundError", "ResourceNotFound", "InternalServiceFault",
  "InvalidParameterCombinationException", "InvalidParameterValueException", "MissingRequiredParameterException",
  "ResourceNotFoundException", "InvalidNextToken", "LimitExceededException",
  "LimitExceededFault", "InvalidFormatFault",
] as const;

export type CloudwatchExceptionName = typeof CloudwatchExceptionNames[number];

export class CloudwatchClientException extends Data.TaggedError("CloudwatchClientException")<
  {
    name: CloudwatchExceptionName;
    cause: Sdk.CloudWatchServiceException
  }
> { } {
}

export function recoverFromCloudwatchException<A, A2, E>(name: CloudwatchExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, CloudwatchClientException>) =>
    Effect.catchIf(
      effect,
      error => error._tag == "CloudwatchClientException" && error.name == name,
      error =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => Effect.succeed(recover))
        )
    )

}
