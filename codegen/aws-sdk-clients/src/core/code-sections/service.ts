import { Effect } from "effect"

import type { Input } from "../main.js";

export const generateClientSection =
  ({ outputFile, allClasses, names, classes, allInterfaces }: Input) =>
    Effect.gen(function* () {

      const serviceName = `${names.capitalizedModuleName}ClientService`;
      const configTagName = `${serviceName}Config`;

      const clientClass = allClasses.find(_ => _.getName()?.endsWith("Client"));
      const configInterface = allInterfaces.find(_ => _.getName()?.endsWith("ClientConfig"));

      if (!clientClass) {
        return yield* Effect.fail("Client's class not found")
      }

      if (!configInterface) {
        return yield* Effect.fail("Client's config interface not found")
      }
      
      outputFile.addClass({
        name: configTagName,
        isExported: true,
        extends: `Context.Tag("${configTagName}")<${configTagName}, Sdk.${configInterface.getName()}>()`
      });

      outputFile.addClass({
        name: serviceName,
        isExported: true,
        extends: `
          Effect.Service<${serviceName}>()("${serviceName}", {
            scoped: Effect.gen(function* () {
        
              const config = 
                yield* pipe(
                  Effect.serviceOption(${configTagName}),
                  Effect.tap(config =>
                    Effect.logDebug("Creating aws client", {
                      "name": "${names.capitalizedModuleName}",
                      "isDefaultConfig": Option.isNone(config)
                    })
                  ),
                  Effect.andThen(
                    Option.getOrUndefined
                  )
                );

              const client = new Sdk.${clientClass.getName()}(config ?? {});

              yield* Effect.addFinalizer(() =>
                pipe(
                  Effect.try(() => client.destroy()),
                  Effect.tapBoth({
                    onFailure: Effect.logWarning,
                    onSuccess: () => Effect.logDebug("aws client has been closed", { client: "${names.capitalizedModuleName}" })
                  }),
                  Effect.merge
                )
              );
  
              const execute = <M extends keyof ${names.clientApiInterfaceName}>(
                name: M,
                input: Parameters<${names.clientApiInterfaceName}[M]>[0]
              ) =>
                pipe(
                  Effect.succeed(${names.commandsFactoryName}[name](input)),
                  Effect.filterOrDieMessage(_ => _ != null, \`Command "$\{name\}" is unknown\`),
                  Effect.tap(Effect.logDebug(\`executing '$\{name\}'\`, input)),
                  Effect.andThen(input =>
                    Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<${names.clientApiInterfaceName}[M]>>)
                  ),
                  Effect.mapError(error =>
                    error.cause instanceof Sdk.${classes.serviceExceptionClass.getName()} ?
                      new ${names.exceptionTypeName}({
                        name: error.cause.name as ${names.exceptionOneOfName},
                        cause: error.cause,
                      }) : new Cause.UnknownException(error)
                  ),
                  Effect.catchTag("UnknownException", Effect.die)
                );
        
              return { execute };
            }),
          })
        `,
      }).formatText();

    })
