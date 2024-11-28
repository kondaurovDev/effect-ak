import * as S from "effect/Schema";
import * as Brand from "effect/Brand";
import type * as Sdk from "@aws-sdk/client-sqs"

export type SdkMessage = Brand.Branded<Sdk.Message, "SdkMessage">;
export const SdkMessage = Brand.nominal<SdkMessage>();

export type SdkSendMessage =
  Partial<Sdk.SendMessageCommandInput> & Brand.Brand<"SdkSendMessage">;
export const SdkSendMessage = Brand.nominal<SdkSendMessage>()

export type ReceiptHandle = typeof ReceiptHandle.Type;
export const ReceiptHandle = S.NonEmptyString.pipe(S.brand("ReceiptHandle"));

export type SQSBatchEvent = typeof SQSBatchEvent.Type;

export const SQSBatchEvent =
  S.Struct({
    Records: S.Array(S.suspend(() => ValidQueueMessage))
  });

export class ValidQueueMessage
  extends S.Class<ValidQueueMessage>("ValidQueueMessage")({
    messageId: S.NonEmptyString,
    messageAttributes:
    S.Record({
      key: S.String,
      value:
        S.Struct({
          dataType: S.UndefinedOr(S.String),
          stringValue: S.UndefinedOr(S.String)
        })
    }).pipe(S.UndefinedOr),
    body: S.NonEmptyString,
    receiptHandle: ReceiptHandle,
  }) { }

export type FifoMessage = 
  Brand.Branded<{
    body: string,
    groupId: string,
    deduplicationId: string
  }, "FifoMessage">