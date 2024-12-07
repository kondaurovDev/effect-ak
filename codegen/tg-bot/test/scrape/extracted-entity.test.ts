import { describe, expect, assert } from "vitest"

import { pageTest } from "../_fixtures/page";

describe("extracted-entity", () => {

  pageTest("logOut", ({ page }) => {

    const entity = page.getEntity("logOut");

    assert(entity._tag == "Right");

    expect(entity.right.entityName).toEqual("logOut");
    assert(entity.right.type.type == "normalType");

    expect(entity.right.type.normalType.tsType).toEqual("never");
    expect(entity.right.entityDescription.returns?.typeNames).toEqual(["true"]);

  });

  pageTest("getMe", ({ page }) => {

    const entity = page.getEntity("getMe");

    assert(entity._tag == "Right");

    expect(entity.right.entityName).toEqual("getMe");
    assert(entity.right.type.type == "normalType");

    expect(entity.right.type.normalType.tsType).toEqual("never")

  });

  pageTest("sendChatAction", ({ page }) => {

    const entity = page.getEntity("sendChatAction");

    assert(entity._tag == "Right");

    expect(entity.right.entityName).toEqual("sendChatAction");
    expect(entity.right.type.type).toEqual("fields");

  });

  pageTest("ForumTopicClosed", async ({ page }) => {

    const entity = page.getEntity("forumTopicClosed");

    assert(entity._tag == "Right");

    assert(entity.right.type.type == "normalType");

    expect(entity.right.type.normalType.tsType).toEqual("never");

    // expect(entity.right.entityName).toEqual("forumTopicClosed");
    // expect(entity.right.type.type).toEqual("fields");
    // expect(entity.right.entityDescription).not.toEqual([]);

  });

  pageTest("ChatFullInfo", ({ page }) => {

    const entity = page.getEntity("ChatFullInfo");

    assert(entity._tag == "Right");

    expect(entity.right.entityDescription.lines[0]).match(/^This object contains full.*/);

    assert(entity.right.type.type == "fields");

    const field1 = entity.right.type.fields.find(_ => _.name == "accent_color_id");

    expect(field1?.required).toBeTruthy();
    expect(field1?.type.tsType).toEqual("number");

    const field2 = entity.right.type.fields.find(_ => _.name == "available_reactions");
    expect(field2?.type.tsType).toEqual("ReactionType[]");
    expect(field2?.required).toBeFalsy();

  })

});
