import { Effect, pipe, Array, Option } from "effect";

import type { Input } from "../main.js";

export const generateExceptionsSection =
  ({ outputFile, allClasses, names }: Input) =>
    Effect.gen(function* () {

      const all =
        pipe(
          Array.filterMap(allClasses, cls => {
            const ext = cls.getExtends();
            if (!ext) return Option.none();
            const extendsFrom = ext.getExpression().getText();
            if (!extendsFrom.endsWith("Exception")) return Option.none();
            const className = cls.getName();
            if (!className) return Option.none();
            const props =
              Array.filterMap(cls.getProperties(), p => {
                if (p.getScope() != "public") {
                  return Option.none();
                }
                return Option.some([p.getName(), p.getType().getApparentType().getText()])
              });

            return Option.some({ extendsFrom, className, props });
          }),
          Array.dedupeWith((a, b) => a.className == b.className),
        );

      const serviceExceptionClass = all.find(_ => _.className.endsWith("ServiceException"));

      if (!serviceExceptionClass) {
        return yield* Effect.fail("Can not find service exception class")
      }

      outputFile.addStatements(writer => {
        writer.blankLine();
        writer.writeLine(`const ${names.exceptionNames} = [`)

        for (const names of Array.chunksOf(3)(all)) {
          writer.writeLine(`  ${names.map(_ => `"${_.className}"`).join(", ")},`);
        }

        writer.writeLine("] as const;");

      });

      outputFile.addTypeAlias({
        name: names.exceptionOneOfName,
        type: `typeof ${names.exceptionNames}[number]`,
        isExported: true
      });

      outputFile.addClass({
        name: names.exceptionTypeName,
        isExported: true,
        extends: writer => {
          writer.writeLine(`Data.TaggedError("${names.exceptionTypeName}")<`).block(() => {
            writer.writeLine(`name: ${names.exceptionOneOfName};`)
            writer.writeLine(`cause: Sdk.${serviceExceptionClass.className}`)
          }).write("> {}")
        }
      }).formatText();

      outputFile.addFunction({
        isExported: true,
        name: `recoverFrom${names.capitalizedModuleName}Exception`,
        typeParameters: ["A", "A2", "E"],
        parameters: [
          {
            name: "name",
            type: names.exceptionOneOfName
          },
          {
            name: "recover",
            type: "A2"
          }
        ],
        statements: `
            return (effect: Effect.Effect<A, ${names.exceptionTypeName}>) =>
              Effect.catchIf(
                effect,
                error => error._tag == "${names.exceptionTypeName}" && error.name == name,
                error =>
                  pipe(
                    Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata }}),
                    Effect.andThen(() => Effect.succeed(recover))
                  )
              )
        `
      }).formatText();

      yield* Effect.tryPromise(() => outputFile.save());

    });
