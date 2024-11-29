import * as S from "effect/Schema";

import { ReceiptHandle } from "../brands.js";

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
    receiptHandle: S.NonEmptyString.pipe(S.fromBrand(ReceiptHandle)),
  }) { }
