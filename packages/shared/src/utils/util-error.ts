import { Data, Cause } from "effect";
import { packageName } from "../common.js";

export class UtilError
  extends Data.TaggedError(`${packageName}.SharedError`)<{
    name: "text" | "date" | "json",
    cause?: Cause.Cause<unknown>,
    details?: unknown
  }> {}