import { Data, Effect, Either, pipe } from "effect";
import * as html_parser from "node-html-parser";

import { HtmlElement } from "#/types";
import { ExtractedEntity } from "../extracted-entity/_model";
import { ExtractedType } from "../extracted-type/_model";
import { ExtractedMethod } from "../extracted-method/_model";
import { DocPageError } from "./errors";

export class DocPage
  extends Data.Class<{
    node: HtmlElement
  }> {

  static fromHtmlString(html: string): Either.Either<DocPage, string> {
    const node = Either.try(() => html_parser.parse(html));
    if (Either.isLeft(node)) return Either.left("InvalidHtml");
    return Either.right(new DocPage({ node: node.right }))
  }

  getEntity(name: string) {
    return pipe(
      Either.fromNullable(
        this.node.querySelector(`a.anchor[name="${name.toLowerCase()}"]`),
        () => DocPageError.make("EntityNoFound", { entityName: name })
      ),
      Either.andThen(_ => ExtractedEntity.makeFrom(_.parentNode))
    )
  }

  getType(name: string) {
    return pipe(
      this.getEntity(name),
      Either.andThen(ExtractedType.makeFrom)
    )
  }

  getMethod(name: string) {
    return pipe(
      this.getEntity(name),
      Either.andThen(ExtractedMethod.makeFrom)
    )
  }

}

