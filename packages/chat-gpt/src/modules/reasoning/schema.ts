import { Schema as S } from "@effect/schema"

export class OutputColumn
  extends S.Class<OutputColumn>("OutputColumn")({
    columnName: S.NonEmptyString,
    description: S.NonEmptyString
  }) { };

export class ReasoningStructuredRequest
  extends S.Class<ReasoningStructuredRequest>("ReasoningStructuredRequest")({
    mainInstruction: S.NonEmptyString,
    outputColumns: OutputColumn.pipe(S.NonEmptyArray),
    inputRequests: S.Object.pipe(S.NonEmptyArray)
  }) { };
