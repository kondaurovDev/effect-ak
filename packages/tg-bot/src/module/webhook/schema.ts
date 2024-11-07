import * as S from "effect/Schema";
import * as DateTime from "effect/DateTime";

import { UpdateEventType } from "../chat/schema/origin-update-event.js";

export const SetWebhookCommand =
  S.Struct({
    url: S.NonEmptyString.pipe(S.pattern(/^https:\/\/.*/)),
    allow_updates: S.UndefinedOr(S.Array(UpdateEventType)),
    drop_pending_updates: S.UndefinedOr(S.Boolean),
    secret_token: S.NonEmptyString.pipe(S.minLength(3))
  });

export const WebhookInfo =
  S.Struct({
    url: S.String,
    pending_update_count: S.Number,
    last_error_date:
      S.transform(
        S.Number,
        S.DateTimeUtcFromSelf,
        {
          strict: true,
          decode: seconds => DateTime.unsafeMake(seconds * 1000),
          encode: dt => dt.epochMillis / 1000
        }
      ).pipe(S.optional)
  })
