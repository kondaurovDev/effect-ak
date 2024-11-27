import * as Data from "effect/Data";
import * as S from "effect/Schema";

export class ServiceError
  extends Data.TaggedError(`ServiceError`)<{
    description: string,
    cause?: unknown
  }> { }

export const sdkClientError =
  <E extends string>(allNames: readonly E[]) => {
    return S.Struct({
      $fault: S.Literal("client", "server"),
      name: S.Literal(...allNames),
      message: S.String,
      $metadata:
        S.Struct({
          httpStatusCode: S.Number,
          requestId: S.String,
          extendedRequestId: S.String,
          attemps: S.Number,
          totalRetryDelay: S.Number
        }).pipe(S.partial)
    })
  }
