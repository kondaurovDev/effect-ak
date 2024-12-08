import { describe, assert } from "vitest";
import { Effect } from "effect";
import { fixture } from "../fixture";

describe("code writer service", () => {

  fixture("create file and write one line", async ({ codeWriter }) => {

    const src = codeWriter.createTsFile("test2");

    assert(src._tag == "Right");

    src.right.addStatements(writer =>
      writer.writeLine("//** fist line")
    );

    const saved = await codeWriter.saveFiles.pipe(Effect.runPromiseExit);

    assert(saved._tag == "Success")

  }),

  fixture("write all types", async ({ codeWriter, page }) => {

    const namespace = EntityNamespace.makeFromPage(page, "primary");

    assert(namespace._tag == "Right");

    codeWriter.writeTypes(namespace.right.types);

    const saved = await codeWriter.saveFiles.pipe(Effect.runPromiseExit);

    assert(saved._tag == "Success")

  })

});
