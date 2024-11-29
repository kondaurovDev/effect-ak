import * as Sdk from "@aws-sdk/client-s3";
import { Effect, Data, pipe, Cause } from "effect";
import { AwsRegionConfig } from "../../core/domain/index.js";

// *****  GENERATED CODE *****
export class S3ClientService extends
  Effect.Service<S3ClientService>()("S3ClientService", {
    scoped: Effect.gen(function*() {
      const region = yield* AwsRegionConfig;

      yield* Effect.logDebug("Creating aws client", { client: "S3" });

      const client = new Sdk.S3Client({ region });

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "S3" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof S3ClientApi>(
        name: M,
        input: Parameters<S3ClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(S3CommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, `Command "${name}" is unknown`),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<S3ClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.S3ServiceException ?
              new S3ClientException({
                name: error.cause.name as S3ExceptionName,
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

export type S3MethodInput<M extends keyof S3ClientApi> = Parameters<S3ClientApi[M]>[0];

export interface S3ClientApi {
  abortMultipartUpload(_: Sdk.AbortMultipartUploadCommandInput): Sdk.AbortMultipartUploadCommandOutput;
  completeMultipartUpload(_: Sdk.CompleteMultipartUploadCommandInput): Sdk.CompleteMultipartUploadCommandOutput;
  copyObject(_: Sdk.CopyObjectCommandInput): Sdk.CopyObjectCommandOutput;
  createBucket(_: Sdk.CreateBucketCommandInput): Sdk.CreateBucketCommandOutput;
  createMultipartUpload(_: Sdk.CreateMultipartUploadCommandInput): Sdk.CreateMultipartUploadCommandOutput;
  createSession(_: Sdk.CreateSessionCommandInput): Sdk.CreateSessionCommandOutput;
  deleteBucketAnalyticsConfiguration(_: Sdk.DeleteBucketAnalyticsConfigurationCommandInput): Sdk.DeleteBucketAnalyticsConfigurationCommandOutput;
  deleteBucket(_: Sdk.DeleteBucketCommandInput): Sdk.DeleteBucketCommandOutput;
  deleteBucketCors(_: Sdk.DeleteBucketCorsCommandInput): Sdk.DeleteBucketCorsCommandOutput;
  deleteBucketEncryption(_: Sdk.DeleteBucketEncryptionCommandInput): Sdk.DeleteBucketEncryptionCommandOutput;
  deleteBucketIntelligentTieringConfiguration(_: Sdk.DeleteBucketIntelligentTieringConfigurationCommandInput): Sdk.DeleteBucketIntelligentTieringConfigurationCommandOutput;
  deleteBucketInventoryConfiguration(_: Sdk.DeleteBucketInventoryConfigurationCommandInput): Sdk.DeleteBucketInventoryConfigurationCommandOutput;
  deleteBucketLifecycle(_: Sdk.DeleteBucketLifecycleCommandInput): Sdk.DeleteBucketLifecycleCommandOutput;
  deleteBucketMetricsConfiguration(_: Sdk.DeleteBucketMetricsConfigurationCommandInput): Sdk.DeleteBucketMetricsConfigurationCommandOutput;
  deleteBucketOwnershipControls(_: Sdk.DeleteBucketOwnershipControlsCommandInput): Sdk.DeleteBucketOwnershipControlsCommandOutput;
  deleteBucketPolicy(_: Sdk.DeleteBucketPolicyCommandInput): Sdk.DeleteBucketPolicyCommandOutput;
  deleteBucketReplication(_: Sdk.DeleteBucketReplicationCommandInput): Sdk.DeleteBucketReplicationCommandOutput;
  deleteBucketTagging(_: Sdk.DeleteBucketTaggingCommandInput): Sdk.DeleteBucketTaggingCommandOutput;
  deleteBucketWebsite(_: Sdk.DeleteBucketWebsiteCommandInput): Sdk.DeleteBucketWebsiteCommandOutput;
  deleteObject(_: Sdk.DeleteObjectCommandInput): Sdk.DeleteObjectCommandOutput;
  deleteObjects(_: Sdk.DeleteObjectsCommandInput): Sdk.DeleteObjectsCommandOutput;
  deleteObjectTagging(_: Sdk.DeleteObjectTaggingCommandInput): Sdk.DeleteObjectTaggingCommandOutput;
  deletePublicAccessBlock(_: Sdk.DeletePublicAccessBlockCommandInput): Sdk.DeletePublicAccessBlockCommandOutput;
  getBucketAccelerateConfiguration(_: Sdk.GetBucketAccelerateConfigurationCommandInput): Sdk.GetBucketAccelerateConfigurationCommandOutput;
  getBucketAcl(_: Sdk.GetBucketAclCommandInput): Sdk.GetBucketAclCommandOutput;
  getBucketAnalyticsConfiguration(_: Sdk.GetBucketAnalyticsConfigurationCommandInput): Sdk.GetBucketAnalyticsConfigurationCommandOutput;
  getBucketCors(_: Sdk.GetBucketCorsCommandInput): Sdk.GetBucketCorsCommandOutput;
  getBucketEncryption(_: Sdk.GetBucketEncryptionCommandInput): Sdk.GetBucketEncryptionCommandOutput;
  getBucketIntelligentTieringConfiguration(_: Sdk.GetBucketIntelligentTieringConfigurationCommandInput): Sdk.GetBucketIntelligentTieringConfigurationCommandOutput;
  getBucketInventoryConfiguration(_: Sdk.GetBucketInventoryConfigurationCommandInput): Sdk.GetBucketInventoryConfigurationCommandOutput;
  getBucketLifecycleConfiguration(_: Sdk.GetBucketLifecycleConfigurationCommandInput): Sdk.GetBucketLifecycleConfigurationCommandOutput;
  getBucketLocation(_: Sdk.GetBucketLocationCommandInput): Sdk.GetBucketLocationCommandOutput;
  getBucketLogging(_: Sdk.GetBucketLoggingCommandInput): Sdk.GetBucketLoggingCommandOutput;
  getBucketMetricsConfiguration(_: Sdk.GetBucketMetricsConfigurationCommandInput): Sdk.GetBucketMetricsConfigurationCommandOutput;
  getBucketNotificationConfiguration(_: Sdk.GetBucketNotificationConfigurationCommandInput): Sdk.GetBucketNotificationConfigurationCommandOutput;
  getBucketOwnershipControls(_: Sdk.GetBucketOwnershipControlsCommandInput): Sdk.GetBucketOwnershipControlsCommandOutput;
  getBucketPolicy(_: Sdk.GetBucketPolicyCommandInput): Sdk.GetBucketPolicyCommandOutput;
  getBucketPolicyStatus(_: Sdk.GetBucketPolicyStatusCommandInput): Sdk.GetBucketPolicyStatusCommandOutput;
  getBucketReplication(_: Sdk.GetBucketReplicationCommandInput): Sdk.GetBucketReplicationCommandOutput;
  getBucketRequestPayment(_: Sdk.GetBucketRequestPaymentCommandInput): Sdk.GetBucketRequestPaymentCommandOutput;
  getBucketTagging(_: Sdk.GetBucketTaggingCommandInput): Sdk.GetBucketTaggingCommandOutput;
  getBucketVersioning(_: Sdk.GetBucketVersioningCommandInput): Sdk.GetBucketVersioningCommandOutput;
  getBucketWebsite(_: Sdk.GetBucketWebsiteCommandInput): Sdk.GetBucketWebsiteCommandOutput;
  getObjectAcl(_: Sdk.GetObjectAclCommandInput): Sdk.GetObjectAclCommandOutput;
  getObjectAttributes(_: Sdk.GetObjectAttributesCommandInput): Sdk.GetObjectAttributesCommandOutput;
  getObject(_: Sdk.GetObjectCommandInput): Sdk.GetObjectCommandOutput;
  getObjectLegalHold(_: Sdk.GetObjectLegalHoldCommandInput): Sdk.GetObjectLegalHoldCommandOutput;
  getObjectLockConfiguration(_: Sdk.GetObjectLockConfigurationCommandInput): Sdk.GetObjectLockConfigurationCommandOutput;
  getObjectRetention(_: Sdk.GetObjectRetentionCommandInput): Sdk.GetObjectRetentionCommandOutput;
  getObjectTagging(_: Sdk.GetObjectTaggingCommandInput): Sdk.GetObjectTaggingCommandOutput;
  getObjectTorrent(_: Sdk.GetObjectTorrentCommandInput): Sdk.GetObjectTorrentCommandOutput;
  getPublicAccessBlock(_: Sdk.GetPublicAccessBlockCommandInput): Sdk.GetPublicAccessBlockCommandOutput;
  headBucket(_: Sdk.HeadBucketCommandInput): Sdk.HeadBucketCommandOutput;
  headObject(_: Sdk.HeadObjectCommandInput): Sdk.HeadObjectCommandOutput;
  listBucketAnalyticsConfigurations(_: Sdk.ListBucketAnalyticsConfigurationsCommandInput): Sdk.ListBucketAnalyticsConfigurationsCommandOutput;
  listBucketIntelligentTieringConfigurations(_: Sdk.ListBucketIntelligentTieringConfigurationsCommandInput): Sdk.ListBucketIntelligentTieringConfigurationsCommandOutput;
  listBucketInventoryConfigurations(_: Sdk.ListBucketInventoryConfigurationsCommandInput): Sdk.ListBucketInventoryConfigurationsCommandOutput;
  listBucketMetricsConfigurations(_: Sdk.ListBucketMetricsConfigurationsCommandInput): Sdk.ListBucketMetricsConfigurationsCommandOutput;
  listBuckets(_: Sdk.ListBucketsCommandInput): Sdk.ListBucketsCommandOutput;
  listDirectoryBuckets(_: Sdk.ListDirectoryBucketsCommandInput): Sdk.ListDirectoryBucketsCommandOutput;
  listMultipartUploads(_: Sdk.ListMultipartUploadsCommandInput): Sdk.ListMultipartUploadsCommandOutput;
  listObjects(_: Sdk.ListObjectsCommandInput): Sdk.ListObjectsCommandOutput;
  listObjectsV2(_: Sdk.ListObjectsV2CommandInput): Sdk.ListObjectsV2CommandOutput;
  listObjectVersions(_: Sdk.ListObjectVersionsCommandInput): Sdk.ListObjectVersionsCommandOutput;
  listParts(_: Sdk.ListPartsCommandInput): Sdk.ListPartsCommandOutput;
  putBucketAccelerateConfiguration(_: Sdk.PutBucketAccelerateConfigurationCommandInput): Sdk.PutBucketAccelerateConfigurationCommandOutput;
  putBucketAcl(_: Sdk.PutBucketAclCommandInput): Sdk.PutBucketAclCommandOutput;
  putBucketAnalyticsConfiguration(_: Sdk.PutBucketAnalyticsConfigurationCommandInput): Sdk.PutBucketAnalyticsConfigurationCommandOutput;
  putBucketCors(_: Sdk.PutBucketCorsCommandInput): Sdk.PutBucketCorsCommandOutput;
  putBucketEncryption(_: Sdk.PutBucketEncryptionCommandInput): Sdk.PutBucketEncryptionCommandOutput;
  putBucketIntelligentTieringConfiguration(_: Sdk.PutBucketIntelligentTieringConfigurationCommandInput): Sdk.PutBucketIntelligentTieringConfigurationCommandOutput;
  putBucketInventoryConfiguration(_: Sdk.PutBucketInventoryConfigurationCommandInput): Sdk.PutBucketInventoryConfigurationCommandOutput;
  putBucketLifecycleConfiguration(_: Sdk.PutBucketLifecycleConfigurationCommandInput): Sdk.PutBucketLifecycleConfigurationCommandOutput;
  putBucketLogging(_: Sdk.PutBucketLoggingCommandInput): Sdk.PutBucketLoggingCommandOutput;
  putBucketMetricsConfiguration(_: Sdk.PutBucketMetricsConfigurationCommandInput): Sdk.PutBucketMetricsConfigurationCommandOutput;
  putBucketNotificationConfiguration(_: Sdk.PutBucketNotificationConfigurationCommandInput): Sdk.PutBucketNotificationConfigurationCommandOutput;
  putBucketOwnershipControls(_: Sdk.PutBucketOwnershipControlsCommandInput): Sdk.PutBucketOwnershipControlsCommandOutput;
  putBucketPolicy(_: Sdk.PutBucketPolicyCommandInput): Sdk.PutBucketPolicyCommandOutput;
  putBucketReplication(_: Sdk.PutBucketReplicationCommandInput): Sdk.PutBucketReplicationCommandOutput;
  putBucketRequestPayment(_: Sdk.PutBucketRequestPaymentCommandInput): Sdk.PutBucketRequestPaymentCommandOutput;
  putBucketTagging(_: Sdk.PutBucketTaggingCommandInput): Sdk.PutBucketTaggingCommandOutput;
  putBucketVersioning(_: Sdk.PutBucketVersioningCommandInput): Sdk.PutBucketVersioningCommandOutput;
  putBucketWebsite(_: Sdk.PutBucketWebsiteCommandInput): Sdk.PutBucketWebsiteCommandOutput;
  putObjectAcl(_: Sdk.PutObjectAclCommandInput): Sdk.PutObjectAclCommandOutput;
  putObject(_: Sdk.PutObjectCommandInput): Sdk.PutObjectCommandOutput;
  putObjectLegalHold(_: Sdk.PutObjectLegalHoldCommandInput): Sdk.PutObjectLegalHoldCommandOutput;
  putObjectLockConfiguration(_: Sdk.PutObjectLockConfigurationCommandInput): Sdk.PutObjectLockConfigurationCommandOutput;
  putObjectRetention(_: Sdk.PutObjectRetentionCommandInput): Sdk.PutObjectRetentionCommandOutput;
  putObjectTagging(_: Sdk.PutObjectTaggingCommandInput): Sdk.PutObjectTaggingCommandOutput;
  putPublicAccessBlock(_: Sdk.PutPublicAccessBlockCommandInput): Sdk.PutPublicAccessBlockCommandOutput;
  restoreObject(_: Sdk.RestoreObjectCommandInput): Sdk.RestoreObjectCommandOutput;
  selectObjectContent(_: Sdk.SelectObjectContentCommandInput): Sdk.SelectObjectContentCommandOutput;
  uploadPart(_: Sdk.UploadPartCommandInput): Sdk.UploadPartCommandOutput;
  uploadPartCopy(_: Sdk.UploadPartCopyCommandInput): Sdk.UploadPartCopyCommandOutput;
  writeGetObjectResponse(_: Sdk.WriteGetObjectResponseCommandInput): Sdk.WriteGetObjectResponseCommandOutput;
}


const S3CommandFactory = {
  abortMultipartUpload: (_: Sdk.AbortMultipartUploadCommandInput) => new Sdk.AbortMultipartUploadCommand(_),
  completeMultipartUpload: (_: Sdk.CompleteMultipartUploadCommandInput) => new Sdk.CompleteMultipartUploadCommand(_),
  copyObject: (_: Sdk.CopyObjectCommandInput) => new Sdk.CopyObjectCommand(_),
  createBucket: (_: Sdk.CreateBucketCommandInput) => new Sdk.CreateBucketCommand(_),
  createMultipartUpload: (_: Sdk.CreateMultipartUploadCommandInput) => new Sdk.CreateMultipartUploadCommand(_),
  createSession: (_: Sdk.CreateSessionCommandInput) => new Sdk.CreateSessionCommand(_),
  deleteBucketAnalyticsConfiguration: (_: Sdk.DeleteBucketAnalyticsConfigurationCommandInput) => new Sdk.DeleteBucketAnalyticsConfigurationCommand(_),
  deleteBucket: (_: Sdk.DeleteBucketCommandInput) => new Sdk.DeleteBucketCommand(_),
  deleteBucketCors: (_: Sdk.DeleteBucketCorsCommandInput) => new Sdk.DeleteBucketCorsCommand(_),
  deleteBucketEncryption: (_: Sdk.DeleteBucketEncryptionCommandInput) => new Sdk.DeleteBucketEncryptionCommand(_),
  deleteBucketIntelligentTieringConfiguration: (_: Sdk.DeleteBucketIntelligentTieringConfigurationCommandInput) => new Sdk.DeleteBucketIntelligentTieringConfigurationCommand(_),
  deleteBucketInventoryConfiguration: (_: Sdk.DeleteBucketInventoryConfigurationCommandInput) => new Sdk.DeleteBucketInventoryConfigurationCommand(_),
  deleteBucketLifecycle: (_: Sdk.DeleteBucketLifecycleCommandInput) => new Sdk.DeleteBucketLifecycleCommand(_),
  deleteBucketMetricsConfiguration: (_: Sdk.DeleteBucketMetricsConfigurationCommandInput) => new Sdk.DeleteBucketMetricsConfigurationCommand(_),
  deleteBucketOwnershipControls: (_: Sdk.DeleteBucketOwnershipControlsCommandInput) => new Sdk.DeleteBucketOwnershipControlsCommand(_),
  deleteBucketPolicy: (_: Sdk.DeleteBucketPolicyCommandInput) => new Sdk.DeleteBucketPolicyCommand(_),
  deleteBucketReplication: (_: Sdk.DeleteBucketReplicationCommandInput) => new Sdk.DeleteBucketReplicationCommand(_),
  deleteBucketTagging: (_: Sdk.DeleteBucketTaggingCommandInput) => new Sdk.DeleteBucketTaggingCommand(_),
  deleteBucketWebsite: (_: Sdk.DeleteBucketWebsiteCommandInput) => new Sdk.DeleteBucketWebsiteCommand(_),
  deleteObject: (_: Sdk.DeleteObjectCommandInput) => new Sdk.DeleteObjectCommand(_),
  deleteObjects: (_: Sdk.DeleteObjectsCommandInput) => new Sdk.DeleteObjectsCommand(_),
  deleteObjectTagging: (_: Sdk.DeleteObjectTaggingCommandInput) => new Sdk.DeleteObjectTaggingCommand(_),
  deletePublicAccessBlock: (_: Sdk.DeletePublicAccessBlockCommandInput) => new Sdk.DeletePublicAccessBlockCommand(_),
  getBucketAccelerateConfiguration: (_: Sdk.GetBucketAccelerateConfigurationCommandInput) => new Sdk.GetBucketAccelerateConfigurationCommand(_),
  getBucketAcl: (_: Sdk.GetBucketAclCommandInput) => new Sdk.GetBucketAclCommand(_),
  getBucketAnalyticsConfiguration: (_: Sdk.GetBucketAnalyticsConfigurationCommandInput) => new Sdk.GetBucketAnalyticsConfigurationCommand(_),
  getBucketCors: (_: Sdk.GetBucketCorsCommandInput) => new Sdk.GetBucketCorsCommand(_),
  getBucketEncryption: (_: Sdk.GetBucketEncryptionCommandInput) => new Sdk.GetBucketEncryptionCommand(_),
  getBucketIntelligentTieringConfiguration: (_: Sdk.GetBucketIntelligentTieringConfigurationCommandInput) => new Sdk.GetBucketIntelligentTieringConfigurationCommand(_),
  getBucketInventoryConfiguration: (_: Sdk.GetBucketInventoryConfigurationCommandInput) => new Sdk.GetBucketInventoryConfigurationCommand(_),
  getBucketLifecycleConfiguration: (_: Sdk.GetBucketLifecycleConfigurationCommandInput) => new Sdk.GetBucketLifecycleConfigurationCommand(_),
  getBucketLocation: (_: Sdk.GetBucketLocationCommandInput) => new Sdk.GetBucketLocationCommand(_),
  getBucketLogging: (_: Sdk.GetBucketLoggingCommandInput) => new Sdk.GetBucketLoggingCommand(_),
  getBucketMetricsConfiguration: (_: Sdk.GetBucketMetricsConfigurationCommandInput) => new Sdk.GetBucketMetricsConfigurationCommand(_),
  getBucketNotificationConfiguration: (_: Sdk.GetBucketNotificationConfigurationCommandInput) => new Sdk.GetBucketNotificationConfigurationCommand(_),
  getBucketOwnershipControls: (_: Sdk.GetBucketOwnershipControlsCommandInput) => new Sdk.GetBucketOwnershipControlsCommand(_),
  getBucketPolicy: (_: Sdk.GetBucketPolicyCommandInput) => new Sdk.GetBucketPolicyCommand(_),
  getBucketPolicyStatus: (_: Sdk.GetBucketPolicyStatusCommandInput) => new Sdk.GetBucketPolicyStatusCommand(_),
  getBucketReplication: (_: Sdk.GetBucketReplicationCommandInput) => new Sdk.GetBucketReplicationCommand(_),
  getBucketRequestPayment: (_: Sdk.GetBucketRequestPaymentCommandInput) => new Sdk.GetBucketRequestPaymentCommand(_),
  getBucketTagging: (_: Sdk.GetBucketTaggingCommandInput) => new Sdk.GetBucketTaggingCommand(_),
  getBucketVersioning: (_: Sdk.GetBucketVersioningCommandInput) => new Sdk.GetBucketVersioningCommand(_),
  getBucketWebsite: (_: Sdk.GetBucketWebsiteCommandInput) => new Sdk.GetBucketWebsiteCommand(_),
  getObjectAcl: (_: Sdk.GetObjectAclCommandInput) => new Sdk.GetObjectAclCommand(_),
  getObjectAttributes: (_: Sdk.GetObjectAttributesCommandInput) => new Sdk.GetObjectAttributesCommand(_),
  getObject: (_: Sdk.GetObjectCommandInput) => new Sdk.GetObjectCommand(_),
  getObjectLegalHold: (_: Sdk.GetObjectLegalHoldCommandInput) => new Sdk.GetObjectLegalHoldCommand(_),
  getObjectLockConfiguration: (_: Sdk.GetObjectLockConfigurationCommandInput) => new Sdk.GetObjectLockConfigurationCommand(_),
  getObjectRetention: (_: Sdk.GetObjectRetentionCommandInput) => new Sdk.GetObjectRetentionCommand(_),
  getObjectTagging: (_: Sdk.GetObjectTaggingCommandInput) => new Sdk.GetObjectTaggingCommand(_),
  getObjectTorrent: (_: Sdk.GetObjectTorrentCommandInput) => new Sdk.GetObjectTorrentCommand(_),
  getPublicAccessBlock: (_: Sdk.GetPublicAccessBlockCommandInput) => new Sdk.GetPublicAccessBlockCommand(_),
  headBucket: (_: Sdk.HeadBucketCommandInput) => new Sdk.HeadBucketCommand(_),
  headObject: (_: Sdk.HeadObjectCommandInput) => new Sdk.HeadObjectCommand(_),
  listBucketAnalyticsConfigurations: (_: Sdk.ListBucketAnalyticsConfigurationsCommandInput) => new Sdk.ListBucketAnalyticsConfigurationsCommand(_),
  listBucketIntelligentTieringConfigurations: (_: Sdk.ListBucketIntelligentTieringConfigurationsCommandInput) => new Sdk.ListBucketIntelligentTieringConfigurationsCommand(_),
  listBucketInventoryConfigurations: (_: Sdk.ListBucketInventoryConfigurationsCommandInput) => new Sdk.ListBucketInventoryConfigurationsCommand(_),
  listBucketMetricsConfigurations: (_: Sdk.ListBucketMetricsConfigurationsCommandInput) => new Sdk.ListBucketMetricsConfigurationsCommand(_),
  listBuckets: (_: Sdk.ListBucketsCommandInput) => new Sdk.ListBucketsCommand(_),
  listDirectoryBuckets: (_: Sdk.ListDirectoryBucketsCommandInput) => new Sdk.ListDirectoryBucketsCommand(_),
  listMultipartUploads: (_: Sdk.ListMultipartUploadsCommandInput) => new Sdk.ListMultipartUploadsCommand(_),
  listObjects: (_: Sdk.ListObjectsCommandInput) => new Sdk.ListObjectsCommand(_),
  listObjectsV2: (_: Sdk.ListObjectsV2CommandInput) => new Sdk.ListObjectsV2Command(_),
  listObjectVersions: (_: Sdk.ListObjectVersionsCommandInput) => new Sdk.ListObjectVersionsCommand(_),
  listParts: (_: Sdk.ListPartsCommandInput) => new Sdk.ListPartsCommand(_),
  putBucketAccelerateConfiguration: (_: Sdk.PutBucketAccelerateConfigurationCommandInput) => new Sdk.PutBucketAccelerateConfigurationCommand(_),
  putBucketAcl: (_: Sdk.PutBucketAclCommandInput) => new Sdk.PutBucketAclCommand(_),
  putBucketAnalyticsConfiguration: (_: Sdk.PutBucketAnalyticsConfigurationCommandInput) => new Sdk.PutBucketAnalyticsConfigurationCommand(_),
  putBucketCors: (_: Sdk.PutBucketCorsCommandInput) => new Sdk.PutBucketCorsCommand(_),
  putBucketEncryption: (_: Sdk.PutBucketEncryptionCommandInput) => new Sdk.PutBucketEncryptionCommand(_),
  putBucketIntelligentTieringConfiguration: (_: Sdk.PutBucketIntelligentTieringConfigurationCommandInput) => new Sdk.PutBucketIntelligentTieringConfigurationCommand(_),
  putBucketInventoryConfiguration: (_: Sdk.PutBucketInventoryConfigurationCommandInput) => new Sdk.PutBucketInventoryConfigurationCommand(_),
  putBucketLifecycleConfiguration: (_: Sdk.PutBucketLifecycleConfigurationCommandInput) => new Sdk.PutBucketLifecycleConfigurationCommand(_),
  putBucketLogging: (_: Sdk.PutBucketLoggingCommandInput) => new Sdk.PutBucketLoggingCommand(_),
  putBucketMetricsConfiguration: (_: Sdk.PutBucketMetricsConfigurationCommandInput) => new Sdk.PutBucketMetricsConfigurationCommand(_),
  putBucketNotificationConfiguration: (_: Sdk.PutBucketNotificationConfigurationCommandInput) => new Sdk.PutBucketNotificationConfigurationCommand(_),
  putBucketOwnershipControls: (_: Sdk.PutBucketOwnershipControlsCommandInput) => new Sdk.PutBucketOwnershipControlsCommand(_),
  putBucketPolicy: (_: Sdk.PutBucketPolicyCommandInput) => new Sdk.PutBucketPolicyCommand(_),
  putBucketReplication: (_: Sdk.PutBucketReplicationCommandInput) => new Sdk.PutBucketReplicationCommand(_),
  putBucketRequestPayment: (_: Sdk.PutBucketRequestPaymentCommandInput) => new Sdk.PutBucketRequestPaymentCommand(_),
  putBucketTagging: (_: Sdk.PutBucketTaggingCommandInput) => new Sdk.PutBucketTaggingCommand(_),
  putBucketVersioning: (_: Sdk.PutBucketVersioningCommandInput) => new Sdk.PutBucketVersioningCommand(_),
  putBucketWebsite: (_: Sdk.PutBucketWebsiteCommandInput) => new Sdk.PutBucketWebsiteCommand(_),
  putObjectAcl: (_: Sdk.PutObjectAclCommandInput) => new Sdk.PutObjectAclCommand(_),
  putObject: (_: Sdk.PutObjectCommandInput) => new Sdk.PutObjectCommand(_),
  putObjectLegalHold: (_: Sdk.PutObjectLegalHoldCommandInput) => new Sdk.PutObjectLegalHoldCommand(_),
  putObjectLockConfiguration: (_: Sdk.PutObjectLockConfigurationCommandInput) => new Sdk.PutObjectLockConfigurationCommand(_),
  putObjectRetention: (_: Sdk.PutObjectRetentionCommandInput) => new Sdk.PutObjectRetentionCommand(_),
  putObjectTagging: (_: Sdk.PutObjectTaggingCommandInput) => new Sdk.PutObjectTaggingCommand(_),
  putPublicAccessBlock: (_: Sdk.PutPublicAccessBlockCommandInput) => new Sdk.PutPublicAccessBlockCommand(_),
  restoreObject: (_: Sdk.RestoreObjectCommandInput) => new Sdk.RestoreObjectCommand(_),
  selectObjectContent: (_: Sdk.SelectObjectContentCommandInput) => new Sdk.SelectObjectContentCommand(_),
  uploadPart: (_: Sdk.UploadPartCommandInput) => new Sdk.UploadPartCommand(_),
  uploadPartCopy: (_: Sdk.UploadPartCopyCommandInput) => new Sdk.UploadPartCopyCommand(_),
  writeGetObjectResponse: (_: Sdk.WriteGetObjectResponseCommandInput) => new Sdk.WriteGetObjectResponseCommand(_),
} as Record<keyof S3ClientApi, (_: unknown) => unknown>


const S3ExceptionNames = [
  "NoSuchUpload", "ObjectNotInActiveTierError", "BucketAlreadyExists",
  "BucketAlreadyOwnedByYou", "NoSuchBucket", "InvalidObjectState",
  "NoSuchKey", "NotFound", "EncryptionTypeMismatch",
  "InvalidRequest", "InvalidWriteOffset", "TooManyParts",
  "ObjectAlreadyInActiveTierError", "S3ServiceException",
] as const;

export type S3ExceptionName = typeof S3ExceptionNames[number];

export class S3ClientException extends Data.TaggedError("S3ClientException")<
  {
    name: S3ExceptionName;
    cause: Sdk.S3ServiceException
  }
> { } {
}

export function recoverFromS3Exception<A, A2, E>(name: S3ExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, S3ClientException>) =>
    Effect.catchIf(
      effect,
      error => error._tag == "S3ClientException" && error.name == name,
      error =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => Effect.succeed(recover))
        )
    )

}
