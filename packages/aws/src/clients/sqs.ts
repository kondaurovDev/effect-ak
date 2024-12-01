import * as Sdk from "@aws-sdk/client-sqs";
import { Effect, Data, pipe, Cause, Context, Option } from "effect";

// *****  GENERATED CODE *****
export class SqsClientServiceConfig extends Context.Tag("SqsClientServiceConfig")<SqsClientServiceConfig, Sdk.SQSClientConfig>() {
}

export class SqsClientService extends
  Effect.Service<SqsClientService>()("SqsClientService", {
    scoped: Effect.gen(function*() {

      const config =
        yield* pipe(
          Effect.serviceOption(SqsClientServiceConfig),
          Effect.tap(config =>
            Effect.logDebug("Creating aws client", {
              "name": "Sqs",
              "isDefaultConfig": Option.isNone(config)
            })
          ),
          Effect.andThen(
            Option.getOrUndefined
          )
        );

      const client = new Sdk.SQSClient(config ?? {});

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "Sqs" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof SqsClientApi>(
        name: M,
        input: Parameters<SqsClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(SqsCommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, `Command "${name}" is unknown`),
          Effect.tap(Effect.logDebug(`executing '${name}'`, input)),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<SqsClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.SQSServiceException ?
              new SqsClientException({
                name: error.cause.name as SqsExceptionName,
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

export type SqsMethodInput<M extends keyof SqsClientApi> = Parameters<SqsClientApi[M]>[0];

export interface SqsClientApi {
  addPermission(_: Sdk.AddPermissionCommandInput): Sdk.AddPermissionCommandOutput;
  cancelMessageMoveTask(_: Sdk.CancelMessageMoveTaskCommandInput): Sdk.CancelMessageMoveTaskCommandOutput;
  changeMessageVisibilityBatch(_: Sdk.ChangeMessageVisibilityBatchCommandInput): Sdk.ChangeMessageVisibilityBatchCommandOutput;
  changeMessageVisibility(_: Sdk.ChangeMessageVisibilityCommandInput): Sdk.ChangeMessageVisibilityCommandOutput;
  createQueue(_: Sdk.CreateQueueCommandInput): Sdk.CreateQueueCommandOutput;
  deleteMessageBatch(_: Sdk.DeleteMessageBatchCommandInput): Sdk.DeleteMessageBatchCommandOutput;
  deleteMessage(_: Sdk.DeleteMessageCommandInput): Sdk.DeleteMessageCommandOutput;
  deleteQueue(_: Sdk.DeleteQueueCommandInput): Sdk.DeleteQueueCommandOutput;
  getQueueAttributes(_: Sdk.GetQueueAttributesCommandInput): Sdk.GetQueueAttributesCommandOutput;
  getQueueUrl(_: Sdk.GetQueueUrlCommandInput): Sdk.GetQueueUrlCommandOutput;
  listDeadLetterSourceQueues(_: Sdk.ListDeadLetterSourceQueuesCommandInput): Sdk.ListDeadLetterSourceQueuesCommandOutput;
  listMessageMoveTasks(_: Sdk.ListMessageMoveTasksCommandInput): Sdk.ListMessageMoveTasksCommandOutput;
  listQueues(_: Sdk.ListQueuesCommandInput): Sdk.ListQueuesCommandOutput;
  listQueueTags(_: Sdk.ListQueueTagsCommandInput): Sdk.ListQueueTagsCommandOutput;
  purgeQueue(_: Sdk.PurgeQueueCommandInput): Sdk.PurgeQueueCommandOutput;
  receiveMessage(_: Sdk.ReceiveMessageCommandInput): Sdk.ReceiveMessageCommandOutput;
  removePermission(_: Sdk.RemovePermissionCommandInput): Sdk.RemovePermissionCommandOutput;
  sendMessageBatch(_: Sdk.SendMessageBatchCommandInput): Sdk.SendMessageBatchCommandOutput;
  sendMessage(_: Sdk.SendMessageCommandInput): Sdk.SendMessageCommandOutput;
  setQueueAttributes(_: Sdk.SetQueueAttributesCommandInput): Sdk.SetQueueAttributesCommandOutput;
  startMessageMoveTask(_: Sdk.StartMessageMoveTaskCommandInput): Sdk.StartMessageMoveTaskCommandOutput;
  tagQueue(_: Sdk.TagQueueCommandInput): Sdk.TagQueueCommandOutput;
  untagQueue(_: Sdk.UntagQueueCommandInput): Sdk.UntagQueueCommandOutput;
}


const SqsCommandFactory = {
  addPermission: (_: Sdk.AddPermissionCommandInput) => new Sdk.AddPermissionCommand(_),
  cancelMessageMoveTask: (_: Sdk.CancelMessageMoveTaskCommandInput) => new Sdk.CancelMessageMoveTaskCommand(_),
  changeMessageVisibilityBatch: (_: Sdk.ChangeMessageVisibilityBatchCommandInput) => new Sdk.ChangeMessageVisibilityBatchCommand(_),
  changeMessageVisibility: (_: Sdk.ChangeMessageVisibilityCommandInput) => new Sdk.ChangeMessageVisibilityCommand(_),
  createQueue: (_: Sdk.CreateQueueCommandInput) => new Sdk.CreateQueueCommand(_),
  deleteMessageBatch: (_: Sdk.DeleteMessageBatchCommandInput) => new Sdk.DeleteMessageBatchCommand(_),
  deleteMessage: (_: Sdk.DeleteMessageCommandInput) => new Sdk.DeleteMessageCommand(_),
  deleteQueue: (_: Sdk.DeleteQueueCommandInput) => new Sdk.DeleteQueueCommand(_),
  getQueueAttributes: (_: Sdk.GetQueueAttributesCommandInput) => new Sdk.GetQueueAttributesCommand(_),
  getQueueUrl: (_: Sdk.GetQueueUrlCommandInput) => new Sdk.GetQueueUrlCommand(_),
  listDeadLetterSourceQueues: (_: Sdk.ListDeadLetterSourceQueuesCommandInput) => new Sdk.ListDeadLetterSourceQueuesCommand(_),
  listMessageMoveTasks: (_: Sdk.ListMessageMoveTasksCommandInput) => new Sdk.ListMessageMoveTasksCommand(_),
  listQueues: (_: Sdk.ListQueuesCommandInput) => new Sdk.ListQueuesCommand(_),
  listQueueTags: (_: Sdk.ListQueueTagsCommandInput) => new Sdk.ListQueueTagsCommand(_),
  purgeQueue: (_: Sdk.PurgeQueueCommandInput) => new Sdk.PurgeQueueCommand(_),
  receiveMessage: (_: Sdk.ReceiveMessageCommandInput) => new Sdk.ReceiveMessageCommand(_),
  removePermission: (_: Sdk.RemovePermissionCommandInput) => new Sdk.RemovePermissionCommand(_),
  sendMessageBatch: (_: Sdk.SendMessageBatchCommandInput) => new Sdk.SendMessageBatchCommand(_),
  sendMessage: (_: Sdk.SendMessageCommandInput) => new Sdk.SendMessageCommand(_),
  setQueueAttributes: (_: Sdk.SetQueueAttributesCommandInput) => new Sdk.SetQueueAttributesCommand(_),
  startMessageMoveTask: (_: Sdk.StartMessageMoveTaskCommandInput) => new Sdk.StartMessageMoveTaskCommand(_),
  tagQueue: (_: Sdk.TagQueueCommandInput) => new Sdk.TagQueueCommand(_),
  untagQueue: (_: Sdk.UntagQueueCommandInput) => new Sdk.UntagQueueCommand(_),
} as Record<keyof SqsClientApi, (_: unknown) => unknown>


const SqsExceptionNames = [
  "InvalidAddress", "InvalidSecurity", "OverLimit",
  "QueueDoesNotExist", "RequestThrottled", "UnsupportedOperation",
  "ResourceNotFoundException", "MessageNotInflight", "ReceiptHandleIsInvalid",
  "BatchEntryIdsNotDistinct", "EmptyBatchRequest", "InvalidBatchEntryId",
  "TooManyEntriesInBatchRequest", "InvalidAttributeName", "InvalidAttributeValue",
  "QueueDeletedRecently", "QueueNameExists", "InvalidIdFormat",
  "PurgeQueueInProgress", "KmsAccessDenied", "KmsDisabled",
  "KmsInvalidKeyUsage", "KmsInvalidState", "KmsNotFound",
  "KmsOptInRequired", "KmsThrottled", "InvalidMessageContents",
  "BatchRequestTooLong", "SQSServiceException",
] as const;

export type SqsExceptionName = typeof SqsExceptionNames[number];

export class SqsClientException extends Data.TaggedError("SqsClientException")<
  {
    name: SqsExceptionName;
    cause: Sdk.SQSServiceException
  }
> { } {
}

export function recoverFromSqsException<A, A2, E>(name: SqsExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, SqsClientException>) =>
    Effect.catchIf(
      effect,
      error => error._tag == "SqsClientException" && error.name == name,
      error =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => Effect.succeed(recover))
        )
    )

}
