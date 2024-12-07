import { describe, expect, assert } from "vitest"

import { pageTest } from "../_fixtures/page";
import { EntityNamespace } from "#/scrape/entity-namespace/_model";

describe("entity namespace", () => {

  pageTest("create primary namespace ", async ({ page }) => {

    const ns = EntityNamespace.makeFromPage(page, "primary");

    if (ns._tag == "Left") {
      console.log(ns.left)
    }

    assert(ns._tag == "Right");

    expect(ns.right.methods.length).toBeGreaterThan(70);
    expect(ns.right.types.length).toBeGreaterThan(100);

  });

});
