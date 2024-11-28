import * as S from "effect/Schema";

import * as C from "../../const.js";
import { amazon_com } from "../../../const.js";
import type { AwsRegionSchema } from "../../../../internal/configuration.js";

export type QueueArn = typeof QueueMetadata.fields.arn.Type;
export type QueueUrl = typeof QueueMetadata.fields.url.Type;
export type QueueName = typeof QueueMetadata.fields.name.Type;

export class QueueMetadata
  extends S.Class<QueueMetadata>("QueueMetadata")({
    name: S.NonEmptyString.pipe(S.pattern(/^[a-zA-Z0-9_-]+$/)),
    arn: S.TemplateLiteral(C.sqs_queue_arn_beginning, S.String),
    url: S.TemplateLiteral(C.sqs_queue_url_beginning, S.String, ".", amazon_com, "/", S.String, "/", S.String)
  }) { }

export const makeQueueUrlFrom =
  (input: {
    region: AwsRegionSchema,
    accountId: number,
    queueName: QueueName
  }): QueueUrl =>
    `${C.sqs_queue_url_beginning}.${input.region}.${amazon_com}/${input.accountId}/${input.queueName}`