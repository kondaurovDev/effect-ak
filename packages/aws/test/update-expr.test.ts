import { describe, it, expect } from "vitest"
import { Effect } from "effect";

import { getUpdateExpression } from "../src/dynamodb/utils/update-expr.js";
import { DynamoDB } from "../src/index.js";

describe("get update expression", () => {

  it("case 1", () => {

    const item = DynamoDB.T.AnyItem({
      textMsg: `test msg`,
      someState: {
        prop1: "blr",
        nested: {
          prop2: "another"
        }
      },
      bla: {
        nestedblr: {
          another: 1
        }
      }
    });

    const actual =
      Effect.runSync(
        getUpdateExpression(item)
      );

    expect(actual.expressionParts).toEqual([
      "#P1 = :P1",
      "#P2.#P2P1 = :P2P1",
      "#P2.#P2P2.#P2P2P1 = :P2P2P1",
      "#P3.#P3P1.#P3P1P1 = :P3P1P1"
    ])

    expect(actual.attributeNames).toEqual(
      DynamoDB.T.AttributeNames({
        "#P1": "textMsg",
        "#P2": "someState",
        "#P2P1": "prop1",
        "#P2P2": "nested",
        "#P2P2P1": "prop2",
        "#P3": "bla",
        "#P3P1": "nestedblr",
        "#P3P1P1": "another",
      })
    );

    expect(actual.attributeValues).toEqual(
      DynamoDB.T.AttributeValues({
        ":P1": { S: "test msg" },
        ":P2P1": { S: "blr" },
        ":P2P2P1": { S: "another" },
        ":P3P1P1": { N: "1" }
      })
    );

  })

  it("nested update", () => {

    const item = DynamoDB.T.AnyItem({
      baz: {
        bar: {
          foo: 1
        }
      }
    });

    const actual = Effect.runSync(getUpdateExpression(item));

    expect(actual.expressionParts)
      .toEqual([
        "#P1.#P1P1.#P1P1P1 = :P1P1P1"
      ]);

    expect(actual.attributeNames)
      .toEqual(DynamoDB.T.AttributeNames({
        "#P1": "baz",
        "#P1P1": "bar",
        "#P1P1P1": "foo",
      }));

    expect(actual.attributeValues)
      .toEqual(DynamoDB.T.AttributeValues({
        ":P1P1P1": { N: "1" }
      }))

  });

  it("simple case", () => {

    const item = DynamoDB.T.AnyItem({
      myProp: 1,
      boolProp: true,
      complex: { foo: "bar", baz: 1 },
      arr: [1, 2],
      other: { name: "a" }
    })

    const actual = Effect.runSync(getUpdateExpression(item));

    expect(actual.expressionParts)
      .toEqual([
        "#P1 = :P1",
        "#P2 = :P2",
        "#P3.#P3P1 = :P3P1",
        "#P3.#P3P2 = :P3P2",
        "#P4 = :P4",
        "#P5.#P5P1 = :P5P1"
      ]);

    expect(actual.attributeNames)
      .toEqual(DynamoDB.T.AttributeNames({
        "#P1": "myProp",
        "#P2": "boolProp",
        "#P3": "complex",
        "#P3P1": "foo",
        "#P3P2": "baz",
        "#P4": "arr",
        "#P5": "other",
        "#P5P1": "name"
      }));

    expect(actual.attributeValues)
      .toEqual(DynamoDB.T.AttributeValues({
        ":P1": { N: "1" },
        ":P2": { BOOL: true },
        ":P3P1": { S: "bar" },
        ":P3P2": { N: "1" },
        ":P4": { L: [{ N: "1" }, { N: "2" }] },
        ":P5P1": { S: "a" }
      }));

  })

  it("empty property shouldn't be in AttributeNames", () => {

    const item = DynamoDB.T.AnyItem({
      foo: 1,
      bar: {
        faa: 2
      },
      baz: { foo: {} }
    });

    const actual = Effect.runSync(getUpdateExpression(item));

    expect(actual.expressionParts).toEqual([
      "#P1 = :P1",
      "#P2.#P2P1 = :P2P1"
    ]);

    expect(actual.attributeNames)
      .toEqual(DynamoDB.T.AttributeNames({
        "#P1": "foo",
        "#P2": "bar",
        "#P2P1": "faa"
      }));

  })

})