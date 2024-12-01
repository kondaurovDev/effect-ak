import { pipe, Effect, Array, Option, String } from "effect"
import type { MethodSignatureStructure } from "ts-morph";

import type { Input } from "../main.js";

export const generateCommandsSection =
  ({ allClasses, names, outputFile }: Input) =>
    Effect.gen(function* () {

      const commands =
        pipe(
          Array.filterMap(allClasses, cls => {
            const originName = cls.getName();
            if (!originName?.endsWith("Command")) return Option.none();
            const methodName = String.uncapitalize(originName.slice(0, originName.length - 7));
            return Option.some({ methodName, originName });
          }),
          Array.dedupeWith((a, b) => a.methodName == b.methodName),
        );

      outputFile.addTypeAlias({
        isExported: true,
        name: `${names.capitalizedModuleName}MethodInput<M extends keyof ${names.clientApiInterfaceName}>`,
        type: `Parameters<${names.clientApiInterfaceName}[M]>[0]`
      })

      outputFile.addInterface({
        isExported: true,
        name: names.clientApiInterfaceName,
        methods: commands.map(cmd => ({
          name: cmd.methodName,
          parameters: [{
            name: "_",
            type: `Sdk.${cmd.originName}Input`
          }],
          returnType: `Sdk.${cmd.originName}Output`
        } as MethodSignatureStructure))
      });

      outputFile.addStatements(writer => {
        writer.blankLine().write(`const ${names.commandsFactoryName} = `).inlineBlock(() => {
          for (const cmd of commands) {
            writer.writeLine(`${cmd.methodName}: (_: Sdk.${cmd.originName}Input) => new Sdk.${cmd.originName}(_),`)
          }
        }).write(` as Record<keyof ${names.clientApiInterfaceName}, (_: unknown) => unknown>`)
      });

      yield* Effect.tryPromise(() => outputFile.save());

    });
