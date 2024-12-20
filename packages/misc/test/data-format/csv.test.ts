import { Effect, Exit, Array } from "effect";
import { assert, describe, expect, it } from "vitest";

import { DataFormatCsvService } from "../../src/data-format"

describe("Csv data service", () => {

  it("encode should work", () => {

    const program = 
      Effect.gen(function* () {

        const service = yield* DataFormatCsvService;

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
          service.decode(encoded1.split("\n"))

        return {
          encoded1, decoded1
        }
      }).pipe(
        Effect.provide(DataFormatCsvService.Default),
        Effect.runSyncExit
      );

    assert(Exit.isSuccess(program))

    expect(program.value.encoded1)
      .toEqual([
        "col1;col2",
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

        const service = yield* DataFormatCsvService;

        const encodedObjects =
          service.encodeObjects([
              {
                price: 2,
                name: "name1"
              },
              {
                price: 5,
                category: "cId2"
              }
            ])

        return {
          encodedObjects
        }
      }).pipe(
        Effect.provide(DataFormatCsvService.Default),
        Effect.tapErrorCause(Effect.logError),
        Effect.runSyncExit
      );

      assert(Exit.isSuccess(program))

      expect(program.value.encodedObjects)
        .toEqual([
          "category;name;price",
          "null;name1;2",
          "cId2;null;5"
        ].join("\n"));

  })


})