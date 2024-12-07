import { Data } from "effect"

import { type ExtractedEntityShape } from "../extracted-entity/_model"

export type ExtractedTypeShape = {
  typeName: string,
  description: string[],
  type: ExtractedEntityShape["type"]
}

export class ExtractedType
  extends Data.TaggedClass("ExtractedMethod")<ExtractedTypeShape> {

    static makeFrom(entity: ExtractedEntityShape) {
      return new ExtractedType({
        typeName: entity.entityName,
        description: entity.entityDescription,
        type: entity.type
      })
    }


  }
