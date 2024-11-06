import * as Either from "effect/Either";
import * as Data from "effect/Data";
import * as Cause from "effect/Cause";
import * as JsonSchema from "effect/JSONSchema";
import * as S from "effect/Schema";

import type { ParseError } from "effect/ParseResult";

import { ToolJsonSchema, OneOfTool, ToolChoice } from "../schema/tool.js";

export class MakeFunctionToolError 
  extends Data.TaggedError("MakeFunctionToolError")<{
    schemaName: string,
    cause: string | Cause.Cause<unknown> | ParseError
  }> {}

export const makeToolChoice = (
  functionName: string
): ToolChoice =>
  ({
    type: "function", 
    function: { name: functionName }
  });

export const makeFunctionTool = <F>(
  schemaName: string,
  functionSchema: S.Schema<F>
) =>
  Either.gen(function* () {

    const jsonSchema = 
      yield* Either.try({
        try: () => JsonSchema.make(functionSchema),
        catch: error => Cause.fail(error)
      })

    const parts = 
      yield* Either.all({
        name: Either.fromNullable(jsonSchema.title, () => "title isn't defined"),
        description: Either.fromNullable(jsonSchema.description, () => "description isn't defined"),
      });

    const jsonSchemaObject =
      yield* S.validateEither(ToolJsonSchema)(jsonSchema);

    return OneOfTool.make({
        type: "function",
        function: {
          name: parts.name,
          description: parts.description,
          parameters: jsonSchemaObject
        }
      })

  }).pipe(
    Either.mapLeft(cause => new MakeFunctionToolError({ cause, schemaName }))
  )
