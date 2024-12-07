import { Data } from "effect";

import { NormalType } from "../normal-type/_model";

export type EntityFieldShape = {
  name: string,
  type: NormalType,
  description: string[],
  required: boolean
}

export class EntityField
  extends Data.TaggedClass("EntityField")<EntityFieldShape> { }
