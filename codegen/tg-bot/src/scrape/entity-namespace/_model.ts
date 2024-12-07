import { Data } from "effect";

import type { ExtractedMethodShape } from "../extracted-method/_model";
import type { ExtractedTypeShape } from "../extracted-type/_model";
import type { EntityNamespaceName } from "./const";
import { extractFromPage } from "./extract";

export type EntityNamespaceShape = {
  namespace: EntityNamespaceName,
  methods: ExtractedMethodShape[],
  types: ExtractedTypeShape[]
}

export class EntityNamespace
  extends Data.TaggedClass("EntityNamespace")<EntityNamespaceShape> {

    static makeFromPage(...input: Parameters<typeof extractFromPage>) {
      return extractFromPage(...input)
    }

  }