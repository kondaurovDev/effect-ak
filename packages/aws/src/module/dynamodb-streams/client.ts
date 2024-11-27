import * as Sdk from "@aws-sdk/client-dynamodb-streams";
import { Effect, Data, pipe, Cause } from "effect";
import { AwsRegionConfig } from "../../internal/index.js";

// *****  GENERATED CODE *****
export class DynamodbStreamsClientService extends
  Effect.Service<DynamodbStreamsClientService>()("DynamodbStreamsClientService", {
    scoped: Effect.gen(function*() {
      const region = yield* AwsRegionConfig;

      yield* Effect.logDebug("Creating aws client", { client: "DynamodbStreams" });

      const client = new Sdk.DynamoDBStreamsClient({ region });

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "DynamodbStreams" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof DynamodbStreamsClientApi>(
        name: M,
        input: Parameters<DynamodbStreamsClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(DynamodbStreamsCommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, `Command "${name}" is unknown`),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<DynamodbStreamsClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.DynamoDBStreamsServiceException ?
              new DynamodbStreamsClientException({
                name: error.cause.name as DynamodbStreamsExceptionName,
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

export type DynamodbStreamsMethodInput<M extends keyof DynamodbStreamsClientApi> = Parameters<DynamodbStreamsClientApi[M]>[0];

export interface DynamodbStreamsClientApi {
  describeStream(_: Sdk.DescribeStreamCommandInput): Sdk.DescribeStreamCommandOutput;
  getRecords(_: Sdk.GetRecordsCommandInput): Sdk.GetRecordsCommandOutput;
  getShardIterator(_: Sdk.GetShardIteratorCommandInput): Sdk.GetShardIteratorCommandOutput;
  listStreams(_: Sdk.ListStreamsCommandInput): Sdk.ListStreamsCommandOutput;
}


const DynamodbStreamsCommandFactory = {
  describeStream: (_: Sdk.DescribeStreamCommandInput) => new Sdk.DescribeStreamCommand(_),
  getRecords: (_: Sdk.GetRecordsCommandInput) => new Sdk.GetRecordsCommand(_),
  getShardIterator: (_: Sdk.GetShardIteratorCommandInput) => new Sdk.GetShardIteratorCommand(_),
  listStreams: (_: Sdk.ListStreamsCommandInput) => new Sdk.ListStreamsCommand(_),
} as Record<keyof DynamodbStreamsClientApi, (_: unknown) => unknown>


const DynamodbStreamsExceptionNames = [
  "DynamoDBStreamsServiceException", "InternalServerError", "ResourceNotFoundException",
  "ExpiredIteratorException", "LimitExceededException", "TrimmedDataAccessException",
] as const;

export type DynamodbStreamsExceptionName = typeof DynamodbStreamsExceptionNames[number];

export class DynamodbStreamsClientException extends Data.TaggedError("DynamodbStreamsClientException")<
  {
    name: DynamodbStreamsExceptionName;
    cause: Sdk.DynamoDBStreamsServiceException
  }
> { } {
}

export function recoverFromDynamodbStreamsException<A, A2, E>(name: DynamodbStreamsExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, DynamodbStreamsClientException>) =>
    Effect.catchIf(
      effect,
      error => error._tag == "DynamodbStreamsClientException" && error.name == name,
      error =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => Effect.succeed(recover))
        )
    )

}
