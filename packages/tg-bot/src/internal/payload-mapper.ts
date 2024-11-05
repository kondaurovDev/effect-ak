import * as S from "effect/Schema";
import { HttpBody } from "@effect/platform";

import { isMessageEffect, messageEffectIdCodesMap } from "./message-effect.js";
import { FileWithContent } from "../module/chat/schema/commands.js";

export const makePayload = (
  body: Record<string, unknown>
) => {
  const result = new FormData();
  for (const [key, value] of Object.entries(body)) {
    if (typeof value == "object") {
      if (S.is(FileWithContent)(value)) {
        result.append(key, new Blob([value.content]), value.fileName);
        continue;
      }
      result.append(key, JSON.stringify(value));
    } else {
      if (key == "message_effect_id" && isMessageEffect(value)) {
        result.append(key, messageEffectIdCodesMap[value]);
        continue;
      }
      result.append(key, value)
    }
  }
  return HttpBody.formData(result);
}
