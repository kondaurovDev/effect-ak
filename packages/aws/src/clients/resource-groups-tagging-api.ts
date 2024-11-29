import * as Sdk from "@aws-sdk/client-resource-groups-tagging-api";
import { Effect, Data, pipe, Cause } from "effect";
import { AwsRegionConfig } from "#core/index.js";

// *****  GENERATED CODE *****
export class ResourceGroupsTaggingApiClientService extends
  Effect.Service<ResourceGroupsTaggingApiClientService>()("ResourceGroupsTaggingApiClientService", {
    scoped: Effect.gen(function*() {
      const region = yield* AwsRegionConfig;

      yield* Effect.logDebug("Creating aws client", { client: "ResourceGroupsTaggingApi" });

      const client = new Sdk.ResourceGroupsTaggingAPIClient({ region });

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "ResourceGroupsTaggingApi" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof ResourceGroupsTaggingApiClientApi>(
        name: M,
        input: Parameters<ResourceGroupsTaggingApiClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(ResourceGroupsTaggingApiCommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, `Command "${name}" is unknown`),
          Effect.tap(Effect.logDebug(`executing '${name}'`, input)),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<ResourceGroupsTaggingApiClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.InternalServiceException ?
              new ResourceGroupsTaggingApiClientException({
                name: error.cause.name as ResourceGroupsTaggingApiExceptionName,
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

export type ResourceGroupsTaggingApiMethodInput<M extends keyof ResourceGroupsTaggingApiClientApi> = Parameters<ResourceGroupsTaggingApiClientApi[M]>[0];

export interface ResourceGroupsTaggingApiClientApi {
  describeReportCreation(_: Sdk.DescribeReportCreationCommandInput): Sdk.DescribeReportCreationCommandOutput;
  getComplianceSummary(_: Sdk.GetComplianceSummaryCommandInput): Sdk.GetComplianceSummaryCommandOutput;
  getResources(_: Sdk.GetResourcesCommandInput): Sdk.GetResourcesCommandOutput;
  getTagKeys(_: Sdk.GetTagKeysCommandInput): Sdk.GetTagKeysCommandOutput;
  getTagValues(_: Sdk.GetTagValuesCommandInput): Sdk.GetTagValuesCommandOutput;
  startReportCreation(_: Sdk.StartReportCreationCommandInput): Sdk.StartReportCreationCommandOutput;
  tagResources(_: Sdk.TagResourcesCommandInput): Sdk.TagResourcesCommandOutput;
  untagResources(_: Sdk.UntagResourcesCommandInput): Sdk.UntagResourcesCommandOutput;
}


const ResourceGroupsTaggingApiCommandFactory = {
  describeReportCreation: (_: Sdk.DescribeReportCreationCommandInput) => new Sdk.DescribeReportCreationCommand(_),
  getComplianceSummary: (_: Sdk.GetComplianceSummaryCommandInput) => new Sdk.GetComplianceSummaryCommand(_),
  getResources: (_: Sdk.GetResourcesCommandInput) => new Sdk.GetResourcesCommand(_),
  getTagKeys: (_: Sdk.GetTagKeysCommandInput) => new Sdk.GetTagKeysCommand(_),
  getTagValues: (_: Sdk.GetTagValuesCommandInput) => new Sdk.GetTagValuesCommand(_),
  startReportCreation: (_: Sdk.StartReportCreationCommandInput) => new Sdk.StartReportCreationCommand(_),
  tagResources: (_: Sdk.TagResourcesCommandInput) => new Sdk.TagResourcesCommand(_),
  untagResources: (_: Sdk.UntagResourcesCommandInput) => new Sdk.UntagResourcesCommand(_),
} as Record<keyof ResourceGroupsTaggingApiClientApi, (_: unknown) => unknown>


const ResourceGroupsTaggingApiExceptionNames = [
  "ConcurrentModificationException", "ConstraintViolationException", "InternalServiceException",
  "InvalidParameterException", "ThrottledException", "PaginationTokenExpiredException",
  "ResourceGroupsTaggingAPIServiceException",
] as const;

export type ResourceGroupsTaggingApiExceptionName = typeof ResourceGroupsTaggingApiExceptionNames[number];

export class ResourceGroupsTaggingApiClientException extends Data.TaggedError("ResourceGroupsTaggingApiClientException")<
  {
    name: ResourceGroupsTaggingApiExceptionName;
    cause: Sdk.InternalServiceException
  }
> { } {
}

export function recoverFromResourceGroupsTaggingApiException<A, A2, E>(name: ResourceGroupsTaggingApiExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, ResourceGroupsTaggingApiClientException>) =>
    Effect.catchIf(
      effect,
      error => error._tag == "ResourceGroupsTaggingApiClientException" && error.name == name,
      error =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => Effect.succeed(recover))
        )
    )

}
