import { pipe, String } from "effect";
import * as Morph from "ts-morph";
import assert from "assert";

import * as Path from "path"

type I = { clientName: string, targetDir: readonly string[] };

export const makeMorphProject =
  ({ clientName, targetDir }: I) => {

    const project =
      new Morph.Project({
        manipulationSettings: {
          indentationText: Morph.IndentationText.TwoSpaces
        }
      })

    project.addSourceFilesAtPaths(`./node_modules/@aws-sdk/client-${clientName}/**/*{.d.ts,.ts}`);

    const allClasses = project.getSourceFiles().flatMap(_ => _.getClasses());
    const allInterfaces = project.getSourceFiles().flatMap(_ => _.getInterfaces());

    console.info("classes " + allClasses.length);

    const out = Path.join(".", targetDir.join(Path.sep), `${clientName}.ts`);
    const outputFile = project.createSourceFile(out, "", { overwrite: true });

    outputFile.addStatements(_ => _.writeLine("// *****  GENERATED CODE *****"));

    outputFile.addImportDeclarations([
      {
        namespaceImport: "Sdk",
        moduleSpecifier: `@aws-sdk/client-${clientName}`,
      },
      {
        namedImports: ["Effect", "Data", "pipe", "Cause", "Context", "Option"],
        moduleSpecifier: "effect"
      }
    ]);

    const capitalizedModuleName =
      pipe(
        String.capitalize(clientName),
        String.kebabToSnake,
        String.snakeToCamel
      );

    const names = {
      capitalizedModuleName,
      clientApiInterfaceName: `${capitalizedModuleName}ClientApi`,
      commandsFactoryName: `${capitalizedModuleName}CommandFactory`,
      serviceExceptionName: `${capitalizedModuleName}ServiceException`,
      exceptionNames: `${capitalizedModuleName}ExceptionNames`,
      exceptionTypeName: `${capitalizedModuleName}ClientException`,
      exceptionOneOfName: `${capitalizedModuleName}ExceptionName`
    };

    const serviceExceptionClass = allClasses.find(_ => _.getName()?.endsWith("ServiceException"));
    assert(serviceExceptionClass, "Can not find service exception class");

    const classes = {
      serviceExceptionClass
    }

    return {
      allClasses, allInterfaces, outputFile, names, classes 
    }
  }
