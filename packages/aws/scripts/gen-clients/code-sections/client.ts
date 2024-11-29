import { Effect } from "effect"
import type { Input } from "../main";
import assert from "assert";

export const generateClientSection =
  ({ outputFile, allClasses, names, classes }: Input) =>
    Effect.gen(function* () {

      const serviceName = `${names.capitalizedModuleName}ClientService`;

      const clientClass = allClasses.find(_ => _.getName()?.endsWith("Client"));

      assert(clientClass, "client class not found");

      outputFile.addClass({
        name: serviceName,
        isExported: true,
        extends: `
          Effect.Service<${serviceName}>()("${serviceName}", {
            scoped: Effect.gen(function* () {
              const region = yield* AwsRegionConfig;
        
              yield* Effect.logDebug("Creating aws client", { client: "${names.capitalizedModuleName}" });
        
              const client = new Sdk.${clientClass.getName()}({ region });

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
