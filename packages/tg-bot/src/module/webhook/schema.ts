import * as S from "effect/Schema";
import { UpdateEventType } from "../chat/schema/origin-update-event.js";

export const SetWebhookCommand =
  S.Struct({
    url: S.NonEmptyString.pipe(S.pattern(/^https:\/\/.*/)),
    allow_updates: S.UndefinedOr(S.Array(UpdateEventType)),
    drop_pending_updates: S.UndefinedOr(S.Boolean),
    secret_token: S.NonEmptyString.pipe(S.minLength(3))
  });
