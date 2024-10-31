import { TaggedError } from "effect/Data";
import { packageName } from "../const.js";

export class UtilError
  extends TaggedError(`${packageName}.SharedError`)<{
    name: "text" | "date" | "json" | "password",
    cause?: unknown,
    details?: unknown
  }> {}