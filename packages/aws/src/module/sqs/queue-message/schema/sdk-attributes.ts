import { pipe } from "effect";
import * as S from "effect/Schema";

export type MessageAttibutes =
  typeof MessageAttibutes.Type;

/**
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference
 */
export const MessageAttibutes =
  pipe(
    S.Record({
      key: S.String,
      value:
        S.Struct({
          DataType: S.Literal("String"),
          StringValue: S.optionalWith(S.String, { exact: true })
        })
    })
  ).annotations({
    title: "MessageAttributes"
  })

export const MessageGroupId =
  pipe(
    S.String,
    S.maxLength(128),
  ).annotations({
    title: "MessageGroupId",
    description: "Messages that belong to the same message group are processed in order (FIFO only)"
  })

export const MessageDeduplicationId =
  pipe(
    S.String,
    S.maxLength(128)
  ).annotations({
    title: "MessageDeduplicationId",
    description: "The token used for deduplication of sent messages (FIFO only)"
  })

export const MessageBody =
  pipe(
    S.String,
    S.minLength(1)
  ).annotations({
    title: "MessageBody",
    description: "The message to send. The minimum size is one character. "
  })
