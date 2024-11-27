import * as Sdk from "@aws-sdk/client-sts";
import { Effect, Data, pipe, Cause } from "effect";
import { AwsRegionConfig } from "../../internal/index.js";

// *****  GENERATED CODE *****
export class StsClientService extends
  Effect.Service<StsClientService>()("StsClientService", {
    scoped: Effect.gen(function*() {
      const region = yield* AwsRegionConfig;

      yield* Effect.logDebug("Creating aws client", { client: "Sts" });

      const client = new Sdk.STSClient({ region });

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "Sts" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof StsClientApi>(
        name: M,
        input: Parameters<StsClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(StsCommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, `Command "${name}" is unknown`),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<StsClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.STSServiceException ?
              new StsClientException({
                name: error.cause.name as StsExceptionName,
                cause: error.cause,
              }) : new Cause.UnknownException(error)
          ),
          Effect.catchTag("UnknownException", Effect.die)
        );

      return { execute };
    }),
  })
{
}

export type StsMethodInput<M extends keyof StsClientApi> = Parameters<StsClientApi[M]>[0];

export interface StsClientApi {
  assumeRole(_: Sdk.AssumeRoleCommandInput): Sdk.AssumeRoleCommandOutput;
  assumeRoleWithSAML(_: Sdk.AssumeRoleWithSAMLCommandInput): Sdk.AssumeRoleWithSAMLCommandOutput;
  assumeRoleWithWebIdentity(_: Sdk.AssumeRoleWithWebIdentityCommandInput): Sdk.AssumeRoleWithWebIdentityCommandOutput;
  assumeRoot(_: Sdk.AssumeRootCommandInput): Sdk.AssumeRootCommandOutput;
  decodeAuthorizationMessage(_: Sdk.DecodeAuthorizationMessageCommandInput): Sdk.DecodeAuthorizationMessageCommandOutput;
  getAccessKeyInfo(_: Sdk.GetAccessKeyInfoCommandInput): Sdk.GetAccessKeyInfoCommandOutput;
  getCallerIdentity(_: Sdk.GetCallerIdentityCommandInput): Sdk.GetCallerIdentityCommandOutput;
  getFederationToken(_: Sdk.GetFederationTokenCommandInput): Sdk.GetFederationTokenCommandOutput;
  getSessionToken(_: Sdk.GetSessionTokenCommandInput): Sdk.GetSessionTokenCommandOutput;
}


const StsCommandFactory = {
  assumeRole: (_: Sdk.AssumeRoleCommandInput) => new Sdk.AssumeRoleCommand(_),
  assumeRoleWithSAML: (_: Sdk.AssumeRoleWithSAMLCommandInput) => new Sdk.AssumeRoleWithSAMLCommand(_),
  assumeRoleWithWebIdentity: (_: Sdk.AssumeRoleWithWebIdentityCommandInput) => new Sdk.AssumeRoleWithWebIdentityCommand(_),
  assumeRoot: (_: Sdk.AssumeRootCommandInput) => new Sdk.AssumeRootCommand(_),
  decodeAuthorizationMessage: (_: Sdk.DecodeAuthorizationMessageCommandInput) => new Sdk.DecodeAuthorizationMessageCommand(_),
  getAccessKeyInfo: (_: Sdk.GetAccessKeyInfoCommandInput) => new Sdk.GetAccessKeyInfoCommand(_),
  getCallerIdentity: (_: Sdk.GetCallerIdentityCommandInput) => new Sdk.GetCallerIdentityCommand(_),
  getFederationToken: (_: Sdk.GetFederationTokenCommandInput) => new Sdk.GetFederationTokenCommand(_),
  getSessionToken: (_: Sdk.GetSessionTokenCommandInput) => new Sdk.GetSessionTokenCommand(_),
} as Record<keyof StsClientApi, (_: unknown) => unknown>


const StsExceptionNames = [
  "ExpiredTokenException", "MalformedPolicyDocumentException", "PackedPolicyTooLargeException",
  "RegionDisabledException", "IDPRejectedClaimException", "InvalidIdentityTokenException",
  "IDPCommunicationErrorException", "InvalidAuthorizationMessageException", "STSServiceException",
] as const;

export type StsExceptionName = typeof StsExceptionNames[number];

export class StsClientException extends Data.TaggedError("StsClientException")<
  {
    name: StsExceptionName;
    cause: Sdk.STSServiceException
  }
> { } {
}

export function recoverFromStsException<A, A2, E>(name: StsExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, StsClientException>) =>
    Effect.catchIf(
      effect,
      error => error._tag == "StsClientException" && error.name == name,
      error =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => Effect.succeed(recover))
        )
    )

}
