import { Data } from "effect";

import type { ExtractedMethodShape } from "../extracted-method/_model";
import type { ExtractedTypeShape } from "../extracted-type/_model";
import { extractFromPage } from "./extract";
import { DocPage } from "../doc-page/_model";

export type ExtractedEntitiesShape = {
  methods: ExtractedMethodShape[],
  types: ExtractedTypeShape[]
}

export class ExtractedEntities
  extends Data.TaggedClass("ExtractedEntities")<ExtractedEntitiesShape> {

    static make(page: DocPage) {
      return extractFromPage(page)
    }

  }