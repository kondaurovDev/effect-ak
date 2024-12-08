import { Either } from "effect";

import type { ExtractEntityError } from "#/scrape/extracted-entity/errors";
import type { DocPage } from "#/scrape/doc-page/_model";
import type { DocPageError } from "#/scrape/doc-page/errors";
import type { ExtractMethodError } from "../extracted-method/errors";
import type { ExtractedEntitiesShape } from "./_model";
import { ExtractedEntitiesError } from "./errors";

const method_type_name_regex = /^\w+$/;

type ExtractError =
  ExtractEntityError | ExtractedEntitiesError | DocPageError | ExtractMethodError

export const extractFromPage = (
  page: DocPage,
): Either.Either<ExtractedEntitiesShape, ExtractError> => {

  const result: ExtractedEntitiesShape = {
    methods: [], types: []
  };

  const nodes = page.node.querySelectorAll("h4 > a");

  if (nodes.length == 0) 
    return Either.left(ExtractedEntitiesError.make("NodesNotFound"))

  for (const node of nodes) {

    const title = node.nextSibling?.text;

    if (!title || !method_type_name_regex.test(title)) continue;

    if (title[0] == title[0].toUpperCase()) { // Is a Type

      const type = page.getType(title);

      if (type._tag == "Left") return Either.left(type.left)

      result.types.push(type.right);
      continue;
    }

    const method = page.getMethod(title);

    if (method._tag == "Left") return Either.left(method.left);

    result.methods.push(method.right);

  }

  return Either.right(result);
}
