import { Data } from "effect";
import { packageName } from "../common.js";

export class UtilError
  extends Data.TaggedError(`${packageName}.SharedError`)<{
    name: "text" | "date" | "json",
    cause?: Error,
    details?: unknown
  }> {}