import { TaggedError } from "effect/Data";
import { miscPackageName } from "../const.js";

export class UtilError
  extends TaggedError(`${miscPackageName}/UtilError`)<{
    name: "text" | "date" | "json" | "password",
    cause?: unknown,
    details?: unknown
  }> {}