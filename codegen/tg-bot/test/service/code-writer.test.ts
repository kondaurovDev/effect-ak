import { describe, assert } from "vitest";
import { Effect } from "effect";

import { fixture } from "../fixture";
import { ExtractedEntities } from "#/scrape/extracted-entities/_model";

describe("code writer service", () => {

  fixture("create file and write one line", async ({ codeWriter, skip }) => {    

    skip();

    const src = codeWriter.createTsFile("test2");

    assert(src._tag == "Right");

    src.right.addStatements(writer =>
      writer.writeLine("//** fist line")
    );

    const saved = await codeWriter.saveFiles.pipe(Effect.runPromiseExit);

    assert(saved._tag == "Success")

  }),

  fixture("write all types/methods", async ({ codeWriter, page }) => {

    const namespace = ExtractedEntities.make(page);

    assert(namespace._tag == "Right");

    codeWriter.writeTypes(namespace.right.types);
    codeWriter.writeMethods(namespace.right.methods);

    const saved = await codeWriter.saveFiles.pipe(Effect.runPromiseExit);

    assert(saved._tag == "Success");

  })

});
