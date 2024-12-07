import { Data, Either, Array } from "effect";

import { makeFrom } from "./factory.js"
import { mapType } from "./map-type.js";

export type NormalTypeShape = {
  typeNames: [string, ...string[]]
}

export class NormalType
  extends Data.TaggedClass("NormalType")<NormalTypeShape> {

  get tsType() {
    return this.typeNames.join(" | ");
  }

  static makeFromNames(...names: [string, ...string[]]) {
    return new NormalType({
      typeNames: Array.map(names, mapType)
    })
  }

  static makeFrom(input: Parameters<typeof makeFrom>[0]) {
    return makeFrom(input).pipe(Either.andThen(_ => new NormalType(_)))
  };

}
