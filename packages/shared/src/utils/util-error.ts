import { TaggedError } from "effect/Data";
import { packageName } from "../common.js";

export class UtilError
  extends TaggedError(`${packageName}.SharedError`)<{
    name: "text" | "date" | "json" | "password",
    cause?: unknown,
    details?: unknown
  }> {}