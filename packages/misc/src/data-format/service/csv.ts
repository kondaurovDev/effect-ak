import { pipe } from "effect/Function";
import * as Array from "effect/Array";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

import { Column, CsvCompatibleObject } from "../types.js";
import { miscModuleName, miscPackageName } from "../../const.js";

export class DataFormatCsvService 
  extends Effect.Service<DataFormatCsvService>()(`${miscPackageName}/DataFormatCsvService`, {
  effect:
    Effect.gen(function* () {

      const columnSeparator = 
        yield* pipe(
          Config.nonEmptyString("column-separator"),
          Config.nested(miscModuleName),
          Config.withDefault(";")
        );

      const encode = <O extends CsvCompatibleObject>(
        input: {
          objects: readonly O[],
          columns: Array.NonEmptyReadonlyArray<Column>,
          sep?: string
        }
      ) => {
        const result = [
          input.columns.map(_ => _.columnName).join(";")
        ];

        for (const object of input.objects) {
          const line = input.columns.reduce(
            (result, column, index) => {
              let val = object[column.columnName];
              if (val == null) { val = null }
              result += 
                index == input.columns.length - 1 ? val : `${val}${columnSeparator}`
              return result;
            },
            ""
          )
          result.push(line);
        }

        return result.join("\n");
      }

      const encodeObjects = <O extends CsvCompatibleObject>(
        input: readonly O[]
      ) => {

        const columns = 
          pipe(
            Array.reduce(
              input,
              [] as string[],
              (result, currentObject) => {
                Object.entries(currentObject).forEach(([ columnName ]) => {
                  if (!result.includes(columnName)) {
                    result.push(columnName)
                  };
                })
                return result;
              }
            ),
            Array.map(
              columnName => Column.make({ columnName })
            )
          );

        columns.sort((a, b) => a.columnName.localeCompare(b.columnName))

        if (Array.isNonEmptyArray(columns)) {
          return [
            encode({ objects: input, columns })
          ].join("\n")
        } else {
          return undefined;
        }

      }

      const decode = (
        lines: string[]
      ) => {
        const result = [] as unknown[];

        const columns = lines[0].split(columnSeparator);

        for (const line of lines.slice(1)) {
          const lineValues = line.split(columnSeparator);
          const currentObject = new Map<string, string | undefined>();
          columns.forEach((column, index) => {
            let columnValue = lineValues.at(index);
            if (columnValue == "undefined" || columnValue == "null") {
              columnValue = undefined;
            }
            return currentObject.set(column, columnValue?.trim());
          })
          result.push(Object.fromEntries(currentObject.entries()));
        }

        return result;

      }

      return {
        encodeObjects, encode, decode, columnSeparator
      } as const;

    })
}) { }
