import { Array, Either } from "effect";

import { HtmlElement } from "#/types.js";
import { ExtractEntityError } from "./errors";
import { NormalTypeShape } from "../normal-type/_model";
import { ExtractedEntityShape } from "./_model";
import { new_entity_tag_set } from "./const";
import { mapType } from "../normal-type/map-type";

const description_split_regex = /(\.\s{1}|\.$)/g;
const contains_letters_regex = /\w{1,}/;
const type_tags_regex = /\w+(?=\<\/(a|em)>)/g
const html_tags_regex = /<\/?[^>]+>/g

const hasReturnType =
  (_: string) =>
    _.startsWith("On Success") ||
    _.endsWith("is returned") ||
    _.startsWith("Returns ");

const removeHtmlTags = 
  (input: string) => input.replace(html_tags_regex, "")

export const extractDescription = (
  node: HtmlElement, entityName: string
): Either.Either<ExtractedEntityShape["entityDescription"], ExtractEntityError> => {

    const lines = [] as string[];

    let returnType: NormalTypeShape | undefined;

    let currentNode = node.nextElementSibling;

    while (currentNode) {

      if (!currentNode || new_entity_tag_set.has(currentNode.tagName)) break;

      for (const line of currentNode.innerHTML.split(description_split_regex)) {

        if (!contains_letters_regex.test(line)) continue;
  
        if (hasReturnType(line)) {
          if (returnType) return ExtractEntityError.left("Description:TooManyReturns", { entityName });
          const typeNames = [...line.matchAll(type_tags_regex)].map(_ => mapType(_[0]));
          if (Array.isNonEmptyArray(typeNames)) {
            returnType = { typeNames }
          } else {
            return ExtractEntityError.left("Description:NoReturnTypes", { entityName });
          }

          continue;
        };

        lines.push(removeHtmlTags(line));
  
      }

      currentNode = currentNode.nextElementSibling;

    }

    if (Array.isNonEmptyArray(lines) && lines[0].length != 0) {
      return Either.right({ lines, returns: returnType })
    };

    return ExtractEntityError.left("Description:Empty");
  }
