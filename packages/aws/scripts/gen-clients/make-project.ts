import { pipe } from "effect/Function";
import * as String from "effect/String";
import * as Morph from "ts-morph";

import assert from "assert";

type I = { moduleName: string };

export const makeMorphProject = 
  ({ moduleName }: I)  => {

    const project =
      new Morph.Project({
        manipulationSettings: {
          indentationText: Morph.IndentationText.TwoSpaces
        }
      });

    project.addSourceFilesAtPaths(`./node_modules/@aws-sdk/client-${moduleName}/**/*{.d.ts,.ts}`);

    const allClasses = project.getSourceFiles().flatMap(_ => _.getClasses());

    console.info("classes " + allClasses.length)

    const out = `./src/clients/${moduleName}.ts`;
    const outputFile = project.createSourceFile(out, "", { overwrite: true });

    outputFile.addStatements(_ => _.writeLine("// *****  GENERATED CODE *****"));

    outputFile.addImportDeclarations([
      {
        namespaceImport: "Sdk",
        moduleSpecifier: `@aws-sdk/client-${moduleName}`,
      },
      {
        namedImports: ["Effect", "Data", "pipe", "Cause"],
        moduleSpecifier: "effect"
      },
      {
        namedImports: ["AwsRegionConfig"],
        moduleSpecifier: "#core/index.js"
      }
    ]);

    const capitalizedModuleName = 
      pipe(
        String.capitalize(moduleName),
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
      allClasses, outputFile, names, classes
    }
  }
  