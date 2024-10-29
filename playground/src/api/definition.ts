import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema, Multipart } from "@effect/platform"
import { Array, ParseResult } from "effect";
import * as S from "effect/Schema";

export class UnknownError extends S.TaggedError<UnknownError>()(
  "UnknownError",
  {}
) {}

const assetPath =
  S.transformOrFail(
    S.NonEmptyString,
    S.NonEmptyArray(S.NonEmptyString),
    {
      strict: true,
      decode: (input, options, ast) => {
        const arr = input.split(":")
        if (Array.isNonEmptyArray(arr)) {
          return ParseResult.succeed(arr)
        } else {
          return ParseResult.fail(
            new ParseResult.Type(
              ast,
              input,
              "Failed to convert string to asset path"
            )
          )
        }
      },
      encode: input => ParseResult.succeed(input.join(":"))
    }
  )

export class Endpoints extends
  HttpApiGroup.make("endpoints")
    .addError(UnknownError, { status: 418 })
    .add(
      HttpApiEndpoint
        .get("verbose", "/verbose")
        .addSuccess(S.Unknown)
    )
    .add(
      HttpApiEndpoint
        .get("compile", "/compile")
        .addSuccess(S.Unknown)
    )
    .add(
      HttpApiEndpoint
        .post("transcribe", "/api/transcribe")
        .setPayload(
          HttpApiSchema.Multipart(
            S.Struct({
              audioFile: Multipart.SingleFileSchema
            })
          )
        )
        .addSuccess(S.Unknown)
    )
    .add(
      HttpApiEndpoint
        .get("rootPage", "/")
        .addSuccess(HttpApiSchema.Text({ contentType: "text/html" }))
    )
    .add(
      HttpApiEndpoint
        .get("transcribeHtmlPage", "/transcribe")
        .addSuccess(HttpApiSchema.Text({ contentType: "text/html" }))
    )
    .add(
      HttpApiEndpoint
        .get("vue-component", "/js/:path")
        .setPath(S.Struct({
          path: S.NonEmptyString
        }))
        .addSuccess(
          S.Union(
            HttpApiSchema.Text({ contentType: "text/javascript" })
          )
        )
    )
    .add(
      HttpApiEndpoint
        .get("vue-component-style", "/css/:path")
        .setPath(S.Struct({
          path: S.NonEmptyString
        }))
        .addSuccess(HttpApiSchema.Text({ contentType: "text/css" }))
    )
    .add(
      HttpApiEndpoint
        .get("vendorJs", "/vendor/js/:path")
        .setPath(S.Struct({
          path: assetPath
        }))
        .addSuccess(HttpApiSchema.Text({ contentType: "text/javascript" }))
    )
    .add(
      HttpApiEndpoint
        .get("vendorCss", "/vendor/css/:path")
        .setPath(S.Struct({
          path: assetPath
        }))
        .addSuccess(HttpApiSchema.Text({ contentType: "text/css" }))
    )
{ }