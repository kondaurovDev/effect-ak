import { Array, Effect, pipe } from "effect";

import { Column, CsvCompatibleObject } from "./types.js";

export class CsvService extends Effect.Service<CsvService>()("CsvService", {
  effect:
    Effect.gen(function* () {

      const defaultSeparator = ";";
      const sepOrDefault = (sep: string | undefined) => sep ?? defaultSeparator;

      const encode = <O extends CsvCompatibleObject>(
        input: {
          objects: readonly O[],
          columns: Array.NonEmptyReadonlyArray<Column>,
          sep?: string
        }
      ) =>
        Array.map(
          input.objects,
          object =>
            input.columns.reduce(
              (result, column, index) => {
                let val = object[column.columnName];
                result += 
                  index == input.columns.length - 1 ? val : `${val}${sepOrDefault(input.sep)}`
                return result;
              },
              ""
            )
        ).join("\n");

      const encodeObjects = <O extends CsvCompatibleObject>(
        input: {
          objects: readonly O[],
          sep?: string
        }
      ) => {

        const columns = 
          pipe(
            Array.reduce(
              input.objects,
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
              columnName => Column.make({ columnName, description: "" })
            )
          );

        if (Array.isNonEmptyArray(columns)) {
          return [
            columns.map(_ => _.columnName).join(sepOrDefault(input.sep)),
            encode({ objects: input.objects, columns })
          ].join("\n")
        } else {
          return undefined;
        }

      }

      const decode = (
        input: {
          lines: string[],
          columns: Array.NonEmptyReadonlyArray<Column>,
          sep?: string
        }
      ) =>
        Array.reduce(
          input.lines,
          [] as Record<string, string | undefined>[],
          (result, currentLine) => {
            const lineValues = currentLine.split(sepOrDefault(input.sep));
            const currentObject = new Map<string, string | undefined>();
            input.columns.forEach((column, index) => {
              let columnValue = lineValues.at(index);
              if (columnValue == "undefined" || columnValue == "null") {
                columnValue = undefined;
              }
              return currentObject.set(column.columnName, columnValue?.trim());
            })
            result.push(Object.fromEntries(currentObject.entries()));
            return result;
          }
        )

      return {
        encodeObjects, encode, decode, defaultSeparator
      } as const;

    })
}) { }
