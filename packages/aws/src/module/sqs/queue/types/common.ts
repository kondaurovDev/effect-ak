import * as S from "effect/Schema";

export type QueueArn = typeof QueueMetadata.fields.arn.Type;
export type QueueUrl = typeof QueueMetadata.fields.url.Type;
export type QueueName = typeof QueueMetadata.fields.name.Type;

export class QueueMetadata
  extends S.Class<QueueMetadata>("QueueMetadata")({
    name: S.NonEmptyString.pipe(S.pattern(/^[a-zA-Z0-9_-]+$/)),
    arn: S.TemplateLiteral("arn:aws:sqs:", S.String),
    url: S.TemplateLiteral("https://sqs.", S.String, ".amazonaws.com/", S.String, "/", S.String)
  }) { }
