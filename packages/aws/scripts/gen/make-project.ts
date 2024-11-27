import { pipe } from "effect/Function";
import * as String from "effect/String";
import * as Morph from "ts-morph";

import assert from "assert";

type I = { moduleName: string, target: string };

export const makeMorphProject = 
  ({ moduleName, target }: I)  => {

    const project =
      new Morph.Project({
        manipulationSettings: {
          indentationText: Morph.IndentationText.TwoSpaces
        }
      });

    project.addSourceFilesAtPaths(`./node_modules/@aws-sdk/client-${moduleName}/**/*{.d.ts,.ts}`);

    const allClasses = project.getSourceFiles().flatMap(_ => _.getClasses());

    console.info("classes " + allClasses.length)

    const out = `./src/module/${target}/client.ts`;
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
        moduleSpecifier: "../../internal/index.js"
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
  