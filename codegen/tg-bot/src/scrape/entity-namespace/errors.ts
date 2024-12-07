import { Data } from "effect";

import type { EntityNamespaceName } from "./const";

type ErrorCode = [
  "NamespaceNotFound"
][number];

type ErrorDetails = {
  namespace?: EntityNamespaceName,
}

export class EntityNamespaceError
  extends Data.TaggedError("EntityNamespaceError")<{
    error: ErrorCode,
    details?: ErrorDetails | undefined
  }> {

  static make(error: ErrorCode, details?: ErrorDetails) {
    return new EntityNamespaceError({ error, details });
  }

}
