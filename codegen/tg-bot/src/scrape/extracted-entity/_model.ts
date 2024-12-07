import { Data, Either } from "effect"

import type { HtmlElement } from "#/types"
import type { NormalType, NormalTypeShape } from "../normal-type/_model"
import type { EntityField } from "../entity-field/_model"
import { extractFromNode } from "./factory"

export type ExtractedEntityShape = {
  entityName: string,
  entityDescription: {
    lines: string[],
    returns: NormalTypeShape | undefined
  },
  type: {
    type: "normalType",
    normalType: NormalType
  } | {
    type: "fields",
    fields: EntityField[]
  }
}

export class ExtractedEntity
  extends Data.TaggedClass("ExtractedEntity")<ExtractedEntityShape> {

    static makeFrom(node: HtmlElement) {
      return extractFromNode(node).pipe(Either.andThen(_ => new ExtractedEntity(_)))
    }

  }
