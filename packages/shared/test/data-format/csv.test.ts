import { Effect, Exit, Array } from "effect";
import { assert, describe, expect, it } from "vitest";

import { CsvService } from "../../src/data-format"

describe("Csv data service", () => {

  it("encode should work", () => {

    const program = 
      Effect.gen(function* () {

        const service = yield* CsvService;

        const columns =
          Array.make(
            { columnName: "col1", "description": "description of col1" },
            { columnName: "col2", "description": "description of col2" },
          )

        const encoded1 =
          service.encode({
            columns,
            objects: [
              {
                col1: "col1ObjValue",
                col2: "col2ObjValue"
              },
              {
                col1: "col1Obj2Value",
                col2: null
              },
            ]
          });

        const decoded1 =
          service.decode({
            columns,
            lines: encoded1.split("\n")
          })

        return {
          encoded1, decoded1
        }
      }).pipe(
        Effect.provide(CsvService.Default),
        Effect.runSyncExit
      );

    assert(Exit.isSuccess(program))

    expect(program.value.encoded1)
      .toEqual([
        "col1ObjValue;col2ObjValue",
        "col1Obj2Value;null"
      ].join("\n"));

    expect(program.value.decoded1)
      .toEqual([
        {
          col1: "col1ObjValue",
          col2: "col2ObjValue"
        },
        {
          col1: "col1Obj2Value",
          col2: undefined
        },
      ])
    
  });

  it("encode objects", () => {
    
    const program = 
      Effect.gen(function* () {

        const service = yield* CsvService;

        const encodedObjects =
          service.encodeObjects({
            objects: [
              {
                price: 2,
                name: "name1"
              },
              {
                price: 5,
                category: "up"
              }
            ],
          })

        return {
          encodedObjects
        }
      }).pipe(
        Effect.provide(CsvService.Default),
        Effect.runSyncExit
      );

      assert(Exit.isSuccess(program))

      expect(program.value.encodedObjects)
        .toEqual([
          "col1ObjValue;col2ObjValue",
          "col1Obj2Value;null"
        ].join("\n"));

  })


})