import * as Sdk from "@aws-sdk/client-dynamoDB";
import { Effect, Data, pipe, Cause } from "effect";
import { AwsRegionConfig } from "../../internal/index.js";

// *****  GENERATED CODE *****
export class DynamoDBClientService extends
  Effect.Service<DynamoDBClientService>()("DynamoDBClientService", {
    scoped: Effect.gen(function*() {
      const region = yield* AwsRegionConfig;

      yield* Effect.logDebug("Creating aws client", { client: "DynamoDB" });

      const client = new Sdk.DynamoDBClient({ region });

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "DynamoDB" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof DynamoDBClientApi>(
        name: M,
        input: Parameters<DynamoDBClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(DynamoDBCommandFactory[name](input)),
          Effect.filterOrFail(_ => _ != null, () => new Cause.RuntimeException(`Command "${name}" is unknown`)),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<DynamoDBClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.DynamoDBServiceException ?
              new DynamoDBClientException({
                name: error.cause.name as DynamoDBExceptionName,
                cause: error.cause,
              }) : new Cause.UnknownException(error)
          )
        );

      return { execute };
    }),
  })
{
}

export type DynamoDBMethodInput<M extends keyof DynamoDBClientApi> = Parameters<DynamoDBClientApi[M]>[0];

export interface DynamoDBClientApi {
  batchExecuteStatement(_: Sdk.BatchExecuteStatementCommandInput): Sdk.BatchExecuteStatementCommandOutput;
  batchGetItem(_: Sdk.BatchGetItemCommandInput): Sdk.BatchGetItemCommandOutput;
  batchWriteItem(_: Sdk.BatchWriteItemCommandInput): Sdk.BatchWriteItemCommandOutput;
  createBackup(_: Sdk.CreateBackupCommandInput): Sdk.CreateBackupCommandOutput;
  createGlobalTable(_: Sdk.CreateGlobalTableCommandInput): Sdk.CreateGlobalTableCommandOutput;
  createTable(_: Sdk.CreateTableCommandInput): Sdk.CreateTableCommandOutput;
  deleteBackup(_: Sdk.DeleteBackupCommandInput): Sdk.DeleteBackupCommandOutput;
  deleteItem(_: Sdk.DeleteItemCommandInput): Sdk.DeleteItemCommandOutput;
  deleteResourcePolicy(_: Sdk.DeleteResourcePolicyCommandInput): Sdk.DeleteResourcePolicyCommandOutput;
  deleteTable(_: Sdk.DeleteTableCommandInput): Sdk.DeleteTableCommandOutput;
  describeBackup(_: Sdk.DescribeBackupCommandInput): Sdk.DescribeBackupCommandOutput;
  describeContinuousBackups(_: Sdk.DescribeContinuousBackupsCommandInput): Sdk.DescribeContinuousBackupsCommandOutput;
  describeContributorInsights(_: Sdk.DescribeContributorInsightsCommandInput): Sdk.DescribeContributorInsightsCommandOutput;
  describeEndpoints(_: Sdk.DescribeEndpointsCommandInput): Sdk.DescribeEndpointsCommandOutput;
  describeExport(_: Sdk.DescribeExportCommandInput): Sdk.DescribeExportCommandOutput;
  describeGlobalTable(_: Sdk.DescribeGlobalTableCommandInput): Sdk.DescribeGlobalTableCommandOutput;
  describeGlobalTableSettings(_: Sdk.DescribeGlobalTableSettingsCommandInput): Sdk.DescribeGlobalTableSettingsCommandOutput;
  describeImport(_: Sdk.DescribeImportCommandInput): Sdk.DescribeImportCommandOutput;
  describeKinesisStreamingDestination(_: Sdk.DescribeKinesisStreamingDestinationCommandInput): Sdk.DescribeKinesisStreamingDestinationCommandOutput;
  describeLimits(_: Sdk.DescribeLimitsCommandInput): Sdk.DescribeLimitsCommandOutput;
  describeTable(_: Sdk.DescribeTableCommandInput): Sdk.DescribeTableCommandOutput;
  describeTableReplicaAutoScaling(_: Sdk.DescribeTableReplicaAutoScalingCommandInput): Sdk.DescribeTableReplicaAutoScalingCommandOutput;
  describeTimeToLive(_: Sdk.DescribeTimeToLiveCommandInput): Sdk.DescribeTimeToLiveCommandOutput;
  disableKinesisStreamingDestination(_: Sdk.DisableKinesisStreamingDestinationCommandInput): Sdk.DisableKinesisStreamingDestinationCommandOutput;
  enableKinesisStreamingDestination(_: Sdk.EnableKinesisStreamingDestinationCommandInput): Sdk.EnableKinesisStreamingDestinationCommandOutput;
  executeStatement(_: Sdk.ExecuteStatementCommandInput): Sdk.ExecuteStatementCommandOutput;
  executeTransaction(_: Sdk.ExecuteTransactionCommandInput): Sdk.ExecuteTransactionCommandOutput;
  exportTableToPointInTime(_: Sdk.ExportTableToPointInTimeCommandInput): Sdk.ExportTableToPointInTimeCommandOutput;
  getItem(_: Sdk.GetItemCommandInput): Sdk.GetItemCommandOutput;
  getResourcePolicy(_: Sdk.GetResourcePolicyCommandInput): Sdk.GetResourcePolicyCommandOutput;
  importTable(_: Sdk.ImportTableCommandInput): Sdk.ImportTableCommandOutput;
  listBackups(_: Sdk.ListBackupsCommandInput): Sdk.ListBackupsCommandOutput;
  listContributorInsights(_: Sdk.ListContributorInsightsCommandInput): Sdk.ListContributorInsightsCommandOutput;
  listExports(_: Sdk.ListExportsCommandInput): Sdk.ListExportsCommandOutput;
  listGlobalTables(_: Sdk.ListGlobalTablesCommandInput): Sdk.ListGlobalTablesCommandOutput;
  listImports(_: Sdk.ListImportsCommandInput): Sdk.ListImportsCommandOutput;
  listTables(_: Sdk.ListTablesCommandInput): Sdk.ListTablesCommandOutput;
  listTagsOfResource(_: Sdk.ListTagsOfResourceCommandInput): Sdk.ListTagsOfResourceCommandOutput;
  putItem(_: Sdk.PutItemCommandInput): Sdk.PutItemCommandOutput;
  putResourcePolicy(_: Sdk.PutResourcePolicyCommandInput): Sdk.PutResourcePolicyCommandOutput;
  query(_: Sdk.QueryCommandInput): Sdk.QueryCommandOutput;
  restoreTableFromBackup(_: Sdk.RestoreTableFromBackupCommandInput): Sdk.RestoreTableFromBackupCommandOutput;
  restoreTableToPointInTime(_: Sdk.RestoreTableToPointInTimeCommandInput): Sdk.RestoreTableToPointInTimeCommandOutput;
  scan(_: Sdk.ScanCommandInput): Sdk.ScanCommandOutput;
  tagResource(_: Sdk.TagResourceCommandInput): Sdk.TagResourceCommandOutput;
  transactGetItems(_: Sdk.TransactGetItemsCommandInput): Sdk.TransactGetItemsCommandOutput;
  transactWriteItems(_: Sdk.TransactWriteItemsCommandInput): Sdk.TransactWriteItemsCommandOutput;
  untagResource(_: Sdk.UntagResourceCommandInput): Sdk.UntagResourceCommandOutput;
  updateContinuousBackups(_: Sdk.UpdateContinuousBackupsCommandInput): Sdk.UpdateContinuousBackupsCommandOutput;
  updateContributorInsights(_: Sdk.UpdateContributorInsightsCommandInput): Sdk.UpdateContributorInsightsCommandOutput;
  updateGlobalTable(_: Sdk.UpdateGlobalTableCommandInput): Sdk.UpdateGlobalTableCommandOutput;
  updateGlobalTableSettings(_: Sdk.UpdateGlobalTableSettingsCommandInput): Sdk.UpdateGlobalTableSettingsCommandOutput;
  updateItem(_: Sdk.UpdateItemCommandInput): Sdk.UpdateItemCommandOutput;
  updateKinesisStreamingDestination(_: Sdk.UpdateKinesisStreamingDestinationCommandInput): Sdk.UpdateKinesisStreamingDestinationCommandOutput;
  updateTable(_: Sdk.UpdateTableCommandInput): Sdk.UpdateTableCommandOutput;
  updateTableReplicaAutoScaling(_: Sdk.UpdateTableReplicaAutoScalingCommandInput): Sdk.UpdateTableReplicaAutoScalingCommandOutput;
  updateTimeToLive(_: Sdk.UpdateTimeToLiveCommandInput): Sdk.UpdateTimeToLiveCommandOutput;
}


const DynamoDBCommandFactory = {
  batchExecuteStatement: (_: Sdk.BatchExecuteStatementCommandInput) => new Sdk.BatchExecuteStatementCommand(_),
  batchGetItem: (_: Sdk.BatchGetItemCommandInput) => new Sdk.BatchGetItemCommand(_),
  batchWriteItem: (_: Sdk.BatchWriteItemCommandInput) => new Sdk.BatchWriteItemCommand(_),
  createBackup: (_: Sdk.CreateBackupCommandInput) => new Sdk.CreateBackupCommand(_),
  createGlobalTable: (_: Sdk.CreateGlobalTableCommandInput) => new Sdk.CreateGlobalTableCommand(_),
  createTable: (_: Sdk.CreateTableCommandInput) => new Sdk.CreateTableCommand(_),
  deleteBackup: (_: Sdk.DeleteBackupCommandInput) => new Sdk.DeleteBackupCommand(_),
  deleteItem: (_: Sdk.DeleteItemCommandInput) => new Sdk.DeleteItemCommand(_),
  deleteResourcePolicy: (_: Sdk.DeleteResourcePolicyCommandInput) => new Sdk.DeleteResourcePolicyCommand(_),
  deleteTable: (_: Sdk.DeleteTableCommandInput) => new Sdk.DeleteTableCommand(_),
  describeBackup: (_: Sdk.DescribeBackupCommandInput) => new Sdk.DescribeBackupCommand(_),
  describeContinuousBackups: (_: Sdk.DescribeContinuousBackupsCommandInput) => new Sdk.DescribeContinuousBackupsCommand(_),
  describeContributorInsights: (_: Sdk.DescribeContributorInsightsCommandInput) => new Sdk.DescribeContributorInsightsCommand(_),
  describeEndpoints: (_: Sdk.DescribeEndpointsCommandInput) => new Sdk.DescribeEndpointsCommand(_),
  describeExport: (_: Sdk.DescribeExportCommandInput) => new Sdk.DescribeExportCommand(_),
  describeGlobalTable: (_: Sdk.DescribeGlobalTableCommandInput) => new Sdk.DescribeGlobalTableCommand(_),
  describeGlobalTableSettings: (_: Sdk.DescribeGlobalTableSettingsCommandInput) => new Sdk.DescribeGlobalTableSettingsCommand(_),
  describeImport: (_: Sdk.DescribeImportCommandInput) => new Sdk.DescribeImportCommand(_),
  describeKinesisStreamingDestination: (_: Sdk.DescribeKinesisStreamingDestinationCommandInput) => new Sdk.DescribeKinesisStreamingDestinationCommand(_),
  describeLimits: (_: Sdk.DescribeLimitsCommandInput) => new Sdk.DescribeLimitsCommand(_),
  describeTable: (_: Sdk.DescribeTableCommandInput) => new Sdk.DescribeTableCommand(_),
  describeTableReplicaAutoScaling: (_: Sdk.DescribeTableReplicaAutoScalingCommandInput) => new Sdk.DescribeTableReplicaAutoScalingCommand(_),
  describeTimeToLive: (_: Sdk.DescribeTimeToLiveCommandInput) => new Sdk.DescribeTimeToLiveCommand(_),
  disableKinesisStreamingDestination: (_: Sdk.DisableKinesisStreamingDestinationCommandInput) => new Sdk.DisableKinesisStreamingDestinationCommand(_),
  enableKinesisStreamingDestination: (_: Sdk.EnableKinesisStreamingDestinationCommandInput) => new Sdk.EnableKinesisStreamingDestinationCommand(_),
  executeStatement: (_: Sdk.ExecuteStatementCommandInput) => new Sdk.ExecuteStatementCommand(_),
  executeTransaction: (_: Sdk.ExecuteTransactionCommandInput) => new Sdk.ExecuteTransactionCommand(_),
  exportTableToPointInTime: (_: Sdk.ExportTableToPointInTimeCommandInput) => new Sdk.ExportTableToPointInTimeCommand(_),
  getItem: (_: Sdk.GetItemCommandInput) => new Sdk.GetItemCommand(_),
  getResourcePolicy: (_: Sdk.GetResourcePolicyCommandInput) => new Sdk.GetResourcePolicyCommand(_),
  importTable: (_: Sdk.ImportTableCommandInput) => new Sdk.ImportTableCommand(_),
  listBackups: (_: Sdk.ListBackupsCommandInput) => new Sdk.ListBackupsCommand(_),
  listContributorInsights: (_: Sdk.ListContributorInsightsCommandInput) => new Sdk.ListContributorInsightsCommand(_),
  listExports: (_: Sdk.ListExportsCommandInput) => new Sdk.ListExportsCommand(_),
  listGlobalTables: (_: Sdk.ListGlobalTablesCommandInput) => new Sdk.ListGlobalTablesCommand(_),
  listImports: (_: Sdk.ListImportsCommandInput) => new Sdk.ListImportsCommand(_),
  listTables: (_: Sdk.ListTablesCommandInput) => new Sdk.ListTablesCommand(_),
  listTagsOfResource: (_: Sdk.ListTagsOfResourceCommandInput) => new Sdk.ListTagsOfResourceCommand(_),
  putItem: (_: Sdk.PutItemCommandInput) => new Sdk.PutItemCommand(_),
  putResourcePolicy: (_: Sdk.PutResourcePolicyCommandInput) => new Sdk.PutResourcePolicyCommand(_),
  query: (_: Sdk.QueryCommandInput) => new Sdk.QueryCommand(_),
  restoreTableFromBackup: (_: Sdk.RestoreTableFromBackupCommandInput) => new Sdk.RestoreTableFromBackupCommand(_),
  restoreTableToPointInTime: (_: Sdk.RestoreTableToPointInTimeCommandInput) => new Sdk.RestoreTableToPointInTimeCommand(_),
  scan: (_: Sdk.ScanCommandInput) => new Sdk.ScanCommand(_),
  tagResource: (_: Sdk.TagResourceCommandInput) => new Sdk.TagResourceCommand(_),
  transactGetItems: (_: Sdk.TransactGetItemsCommandInput) => new Sdk.TransactGetItemsCommand(_),
  transactWriteItems: (_: Sdk.TransactWriteItemsCommandInput) => new Sdk.TransactWriteItemsCommand(_),
  untagResource: (_: Sdk.UntagResourceCommandInput) => new Sdk.UntagResourceCommand(_),
  updateContinuousBackups: (_: Sdk.UpdateContinuousBackupsCommandInput) => new Sdk.UpdateContinuousBackupsCommand(_),
  updateContributorInsights: (_: Sdk.UpdateContributorInsightsCommandInput) => new Sdk.UpdateContributorInsightsCommand(_),
  updateGlobalTable: (_: Sdk.UpdateGlobalTableCommandInput) => new Sdk.UpdateGlobalTableCommand(_),
  updateGlobalTableSettings: (_: Sdk.UpdateGlobalTableSettingsCommandInput) => new Sdk.UpdateGlobalTableSettingsCommand(_),
  updateItem: (_: Sdk.UpdateItemCommandInput) => new Sdk.UpdateItemCommand(_),
  updateKinesisStreamingDestination: (_: Sdk.UpdateKinesisStreamingDestinationCommandInput) => new Sdk.UpdateKinesisStreamingDestinationCommand(_),
  updateTable: (_: Sdk.UpdateTableCommandInput) => new Sdk.UpdateTableCommand(_),
  updateTableReplicaAutoScaling: (_: Sdk.UpdateTableReplicaAutoScalingCommandInput) => new Sdk.UpdateTableReplicaAutoScalingCommand(_),
  updateTimeToLive: (_: Sdk.UpdateTimeToLiveCommandInput) => new Sdk.UpdateTimeToLiveCommand(_),
} as Record<keyof DynamoDBClientApi, (_: unknown) => unknown>


const dynamoDBExceptionNames = [
  "DynamoDBServiceException", "BackupInUseException", "BackupNotFoundException",
  "InternalServerError", "RequestLimitExceeded", "InvalidEndpointException",
  "ProvisionedThroughputExceededException", "ResourceNotFoundException", "ItemCollectionSizeLimitExceededException",
  "ContinuousBackupsUnavailableException", "LimitExceededException", "TableInUseException",
  "TableNotFoundException", "GlobalTableAlreadyExistsException", "ResourceInUseException",
  "TransactionConflictException", "PolicyNotFoundException", "ExportNotFoundException",
  "GlobalTableNotFoundException", "ImportNotFoundException", "DuplicateItemException",
  "IdempotentParameterMismatchException", "TransactionInProgressException", "ExportConflictException",
  "InvalidExportTimeException", "PointInTimeRecoveryUnavailableException", "ImportConflictException",
  "TableAlreadyExistsException", "InvalidRestoreTimeException", "ReplicaAlreadyExistsException",
  "ReplicaNotFoundException", "IndexNotFoundException", "ConditionalCheckFailedException",
  "TransactionCanceledException",
] as const;

export type DynamoDBExceptionName = typeof dynamoDBExceptionNames[number];

export class DynamoDBClientException extends Data.TaggedError("DynamoDBClientException")<
  {
    name: DynamoDBExceptionName;
    cause: Sdk.DynamoDBServiceException
  }
> { } {
}

export function recoverFromDynamoDBException<A, A2>(name: DynamoDBExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, DynamoDBClientException | Cause.UnknownException>) =>
    Effect.catchIf(
      effect,
      (error): error is DynamoDBClientException => error._tag == "DynamoDBClientException" && error.name == name,
      (error) =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => recover)
        )
    )

}
