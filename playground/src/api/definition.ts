import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "@effect/platform"
import { ParseResult, Array } from "effect";
import * as S from "effect/Schema";

export class UnknownError
  extends S.TaggedError<UnknownError>()(
    "UnknownError",
    {}
  ) { }

const StaticFileUrlPath =
  S.transformOrFail(
    S.NonEmptyString,
    S.NonEmptyArray(S.NonEmptyString),
    {
      strict: true,
      decode: _ => {
        const els = _.split(":");
        if (Array.isNonEmptyArray(els)) {
          return ParseResult.succeed(els);
        } else {
          return ParseResult.fail(
            new ParseResult.Unexpected(els, "Is empty")
          )
        }
      },
      encode: _ => ParseResult.succeed(_.join(":"))
    }
  )

export class ApiEndpoints extends
  HttpApiGroup.make("api")
    .addError(UnknownError, { status: 418 })
    .add(
      HttpApiEndpoint
        .get("debug", "/api/debug")
        .addSuccess(HttpApiSchema.Text({ contentType: "text/html" }))
    ).add(
      HttpApiEndpoint
        .get("ask-ai", "/api/ask-ai")
        .setUrlParams(
          S.Struct({
            question: S.NonEmptyString
          })
        )
        .addSuccess(HttpApiSchema.Text({ contentType: "text/html" }))
    ).add(
      HttpApiEndpoint
        .get("generate-image", "/api/generate-image")
        .setUrlParams(
          S.Struct({
            description: S.NonEmptyString
          })
        )
        .addSuccess(HttpApiSchema.Text({ contentType: "text/html" }))
    )
{ }

export class PageEndpoints extends
  HttpApiGroup.make("html")
    .addError(UnknownError, { status: 418 })
    .add(
      HttpApiEndpoint
        .get("page", "/page/:path")
        .setPath(
          S.Struct({ path: StaticFileUrlPath })
        )
        .addSuccess(HttpApiSchema.Text({ contentType: "text/html" }))
    )
{ }

export class StaticFilesEndpoints extends
  HttpApiGroup.make("static")
    .addError(UnknownError, { status: 418 })
    .add(
      HttpApiEndpoint
        .get("css", "/css/:path")
        .setPath(
          S.Struct({ path: StaticFileUrlPath })
        )
        .addSuccess(HttpApiSchema.Text({ contentType: "text/css" }))
    ).add(
      HttpApiEndpoint
        .get("js", "/js/:path")
        .setPath(
          S.Struct({ path: StaticFileUrlPath })
        )
        .addSuccess(HttpApiSchema.Text({ contentType: "text/javascript" }))
    ).add(
      HttpApiEndpoint
        .get("generated-image", "/image/ai/:path")
        .setPath(
          S.Struct({ path: StaticFileUrlPath })
        )
        .addSuccess(HttpApiSchema.Uint8Array({ contentType: "image/webp" }))
    )
{ }
