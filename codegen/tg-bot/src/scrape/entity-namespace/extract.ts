import { Either } from "effect";

import type { ExtractEntityError } from "#/scrape/extracted-entity/errors";
import type { DocPage } from "#/scrape/doc-page/_model";
import type { DocPageError } from "#/scrape/doc-page/errors";
import type { EntityNamespaceShape } from "./_model";
import type { ExtractMethodError } from "../extracted-method/errors";
import { namespacesMap, type EntityNamespaceName } from "./const";
import { EntityNamespaceError } from "./errors";

const method_type_name_regex = /^\w+$/;

type ExtractError =
  ExtractEntityError | EntityNamespaceError | DocPageError | ExtractMethodError

export const extractFromPage = (
  page: DocPage,
  namespace: EntityNamespaceName
): Either.Either<EntityNamespaceShape, ExtractError> => {
  const result: EntityNamespaceShape = {
    namespace, methods: [], types: []
  };

  for (const selector of namespacesMap[namespace].selectors) {

    const nodes = page.node.querySelectorAll(selector);

    if (nodes.length == 0) {
      return Either.left(EntityNamespaceError.make("NamespaceNotFound", { namespace }));
    }

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

  }

  return Either.right(result);
}
