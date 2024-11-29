import * as Sdk from "@aws-sdk/client-lambda";
import { Effect, Data, pipe, Cause } from "effect";
import { AwsRegionConfig } from "#core/index.js";

// *****  GENERATED CODE *****
export class LambdaClientService extends
  Effect.Service<LambdaClientService>()("LambdaClientService", {
    scoped: Effect.gen(function*() {
      const region = yield* AwsRegionConfig;

      yield* Effect.logDebug("Creating aws client", { client: "Lambda" });

      const client = new Sdk.LambdaClient({ region });

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "Lambda" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof LambdaClientApi>(
        name: M,
        input: Parameters<LambdaClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(LambdaCommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, `Command "${name}" is unknown`),
          Effect.tap(Effect.logDebug(`executing '${name}'`, input)),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<LambdaClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.LambdaServiceException ?
              new LambdaClientException({
                name: error.cause.name as LambdaExceptionName,
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

export type LambdaMethodInput<M extends keyof LambdaClientApi> = Parameters<LambdaClientApi[M]>[0];

export interface LambdaClientApi {
  addLayerVersionPermission(_: Sdk.AddLayerVersionPermissionCommandInput): Sdk.AddLayerVersionPermissionCommandOutput;
  addPermission(_: Sdk.AddPermissionCommandInput): Sdk.AddPermissionCommandOutput;
  createAlias(_: Sdk.CreateAliasCommandInput): Sdk.CreateAliasCommandOutput;
  createCodeSigningConfig(_: Sdk.CreateCodeSigningConfigCommandInput): Sdk.CreateCodeSigningConfigCommandOutput;
  createEventSourceMapping(_: Sdk.CreateEventSourceMappingCommandInput): Sdk.CreateEventSourceMappingCommandOutput;
  createFunction(_: Sdk.CreateFunctionCommandInput): Sdk.CreateFunctionCommandOutput;
  createFunctionUrlConfig(_: Sdk.CreateFunctionUrlConfigCommandInput): Sdk.CreateFunctionUrlConfigCommandOutput;
  deleteAlias(_: Sdk.DeleteAliasCommandInput): Sdk.DeleteAliasCommandOutput;
  deleteCodeSigningConfig(_: Sdk.DeleteCodeSigningConfigCommandInput): Sdk.DeleteCodeSigningConfigCommandOutput;
  deleteEventSourceMapping(_: Sdk.DeleteEventSourceMappingCommandInput): Sdk.DeleteEventSourceMappingCommandOutput;
  deleteFunctionCodeSigningConfig(_: Sdk.DeleteFunctionCodeSigningConfigCommandInput): Sdk.DeleteFunctionCodeSigningConfigCommandOutput;
  deleteFunction(_: Sdk.DeleteFunctionCommandInput): Sdk.DeleteFunctionCommandOutput;
  deleteFunctionConcurrency(_: Sdk.DeleteFunctionConcurrencyCommandInput): Sdk.DeleteFunctionConcurrencyCommandOutput;
  deleteFunctionEventInvokeConfig(_: Sdk.DeleteFunctionEventInvokeConfigCommandInput): Sdk.DeleteFunctionEventInvokeConfigCommandOutput;
  deleteFunctionUrlConfig(_: Sdk.DeleteFunctionUrlConfigCommandInput): Sdk.DeleteFunctionUrlConfigCommandOutput;
  deleteLayerVersion(_: Sdk.DeleteLayerVersionCommandInput): Sdk.DeleteLayerVersionCommandOutput;
  deleteProvisionedConcurrencyConfig(_: Sdk.DeleteProvisionedConcurrencyConfigCommandInput): Sdk.DeleteProvisionedConcurrencyConfigCommandOutput;
  getAccountSettings(_: Sdk.GetAccountSettingsCommandInput): Sdk.GetAccountSettingsCommandOutput;
  getAlias(_: Sdk.GetAliasCommandInput): Sdk.GetAliasCommandOutput;
  getCodeSigningConfig(_: Sdk.GetCodeSigningConfigCommandInput): Sdk.GetCodeSigningConfigCommandOutput;
  getEventSourceMapping(_: Sdk.GetEventSourceMappingCommandInput): Sdk.GetEventSourceMappingCommandOutput;
  getFunctionCodeSigningConfig(_: Sdk.GetFunctionCodeSigningConfigCommandInput): Sdk.GetFunctionCodeSigningConfigCommandOutput;
  getFunction(_: Sdk.GetFunctionCommandInput): Sdk.GetFunctionCommandOutput;
  getFunctionConcurrency(_: Sdk.GetFunctionConcurrencyCommandInput): Sdk.GetFunctionConcurrencyCommandOutput;
  getFunctionConfiguration(_: Sdk.GetFunctionConfigurationCommandInput): Sdk.GetFunctionConfigurationCommandOutput;
  getFunctionEventInvokeConfig(_: Sdk.GetFunctionEventInvokeConfigCommandInput): Sdk.GetFunctionEventInvokeConfigCommandOutput;
  getFunctionRecursionConfig(_: Sdk.GetFunctionRecursionConfigCommandInput): Sdk.GetFunctionRecursionConfigCommandOutput;
  getFunctionUrlConfig(_: Sdk.GetFunctionUrlConfigCommandInput): Sdk.GetFunctionUrlConfigCommandOutput;
  getLayerVersionByArn(_: Sdk.GetLayerVersionByArnCommandInput): Sdk.GetLayerVersionByArnCommandOutput;
  getLayerVersion(_: Sdk.GetLayerVersionCommandInput): Sdk.GetLayerVersionCommandOutput;
  getLayerVersionPolicy(_: Sdk.GetLayerVersionPolicyCommandInput): Sdk.GetLayerVersionPolicyCommandOutput;
  getPolicy(_: Sdk.GetPolicyCommandInput): Sdk.GetPolicyCommandOutput;
  getProvisionedConcurrencyConfig(_: Sdk.GetProvisionedConcurrencyConfigCommandInput): Sdk.GetProvisionedConcurrencyConfigCommandOutput;
  getRuntimeManagementConfig(_: Sdk.GetRuntimeManagementConfigCommandInput): Sdk.GetRuntimeManagementConfigCommandOutput;
  invokeAsync(_: Sdk.InvokeAsyncCommandInput): Sdk.InvokeAsyncCommandOutput;
  invoke(_: Sdk.InvokeCommandInput): Sdk.InvokeCommandOutput;
  invokeWithResponseStream(_: Sdk.InvokeWithResponseStreamCommandInput): Sdk.InvokeWithResponseStreamCommandOutput;
  listAliases(_: Sdk.ListAliasesCommandInput): Sdk.ListAliasesCommandOutput;
  listCodeSigningConfigs(_: Sdk.ListCodeSigningConfigsCommandInput): Sdk.ListCodeSigningConfigsCommandOutput;
  listEventSourceMappings(_: Sdk.ListEventSourceMappingsCommandInput): Sdk.ListEventSourceMappingsCommandOutput;
  listFunctionEventInvokeConfigs(_: Sdk.ListFunctionEventInvokeConfigsCommandInput): Sdk.ListFunctionEventInvokeConfigsCommandOutput;
  listFunctionsByCodeSigningConfig(_: Sdk.ListFunctionsByCodeSigningConfigCommandInput): Sdk.ListFunctionsByCodeSigningConfigCommandOutput;
  listFunctions(_: Sdk.ListFunctionsCommandInput): Sdk.ListFunctionsCommandOutput;
  listFunctionUrlConfigs(_: Sdk.ListFunctionUrlConfigsCommandInput): Sdk.ListFunctionUrlConfigsCommandOutput;
  listLayers(_: Sdk.ListLayersCommandInput): Sdk.ListLayersCommandOutput;
  listLayerVersions(_: Sdk.ListLayerVersionsCommandInput): Sdk.ListLayerVersionsCommandOutput;
  listProvisionedConcurrencyConfigs(_: Sdk.ListProvisionedConcurrencyConfigsCommandInput): Sdk.ListProvisionedConcurrencyConfigsCommandOutput;
  listTags(_: Sdk.ListTagsCommandInput): Sdk.ListTagsCommandOutput;
  listVersionsByFunction(_: Sdk.ListVersionsByFunctionCommandInput): Sdk.ListVersionsByFunctionCommandOutput;
  publishLayerVersion(_: Sdk.PublishLayerVersionCommandInput): Sdk.PublishLayerVersionCommandOutput;
  publishVersion(_: Sdk.PublishVersionCommandInput): Sdk.PublishVersionCommandOutput;
  putFunctionCodeSigningConfig(_: Sdk.PutFunctionCodeSigningConfigCommandInput): Sdk.PutFunctionCodeSigningConfigCommandOutput;
  putFunctionConcurrency(_: Sdk.PutFunctionConcurrencyCommandInput): Sdk.PutFunctionConcurrencyCommandOutput;
  putFunctionEventInvokeConfig(_: Sdk.PutFunctionEventInvokeConfigCommandInput): Sdk.PutFunctionEventInvokeConfigCommandOutput;
  putFunctionRecursionConfig(_: Sdk.PutFunctionRecursionConfigCommandInput): Sdk.PutFunctionRecursionConfigCommandOutput;
  putProvisionedConcurrencyConfig(_: Sdk.PutProvisionedConcurrencyConfigCommandInput): Sdk.PutProvisionedConcurrencyConfigCommandOutput;
  putRuntimeManagementConfig(_: Sdk.PutRuntimeManagementConfigCommandInput): Sdk.PutRuntimeManagementConfigCommandOutput;
  removeLayerVersionPermission(_: Sdk.RemoveLayerVersionPermissionCommandInput): Sdk.RemoveLayerVersionPermissionCommandOutput;
  removePermission(_: Sdk.RemovePermissionCommandInput): Sdk.RemovePermissionCommandOutput;
  tagResource(_: Sdk.TagResourceCommandInput): Sdk.TagResourceCommandOutput;
  untagResource(_: Sdk.UntagResourceCommandInput): Sdk.UntagResourceCommandOutput;
  updateAlias(_: Sdk.UpdateAliasCommandInput): Sdk.UpdateAliasCommandOutput;
  updateCodeSigningConfig(_: Sdk.UpdateCodeSigningConfigCommandInput): Sdk.UpdateCodeSigningConfigCommandOutput;
  updateEventSourceMapping(_: Sdk.UpdateEventSourceMappingCommandInput): Sdk.UpdateEventSourceMappingCommandOutput;
  updateFunctionCode(_: Sdk.UpdateFunctionCodeCommandInput): Sdk.UpdateFunctionCodeCommandOutput;
  updateFunctionConfiguration(_: Sdk.UpdateFunctionConfigurationCommandInput): Sdk.UpdateFunctionConfigurationCommandOutput;
  updateFunctionEventInvokeConfig(_: Sdk.UpdateFunctionEventInvokeConfigCommandInput): Sdk.UpdateFunctionEventInvokeConfigCommandOutput;
  updateFunctionUrlConfig(_: Sdk.UpdateFunctionUrlConfigCommandInput): Sdk.UpdateFunctionUrlConfigCommandOutput;
}


const LambdaCommandFactory = {
  addLayerVersionPermission: (_: Sdk.AddLayerVersionPermissionCommandInput) => new Sdk.AddLayerVersionPermissionCommand(_),
  addPermission: (_: Sdk.AddPermissionCommandInput) => new Sdk.AddPermissionCommand(_),
  createAlias: (_: Sdk.CreateAliasCommandInput) => new Sdk.CreateAliasCommand(_),
  createCodeSigningConfig: (_: Sdk.CreateCodeSigningConfigCommandInput) => new Sdk.CreateCodeSigningConfigCommand(_),
  createEventSourceMapping: (_: Sdk.CreateEventSourceMappingCommandInput) => new Sdk.CreateEventSourceMappingCommand(_),
  createFunction: (_: Sdk.CreateFunctionCommandInput) => new Sdk.CreateFunctionCommand(_),
  createFunctionUrlConfig: (_: Sdk.CreateFunctionUrlConfigCommandInput) => new Sdk.CreateFunctionUrlConfigCommand(_),
  deleteAlias: (_: Sdk.DeleteAliasCommandInput) => new Sdk.DeleteAliasCommand(_),
  deleteCodeSigningConfig: (_: Sdk.DeleteCodeSigningConfigCommandInput) => new Sdk.DeleteCodeSigningConfigCommand(_),
  deleteEventSourceMapping: (_: Sdk.DeleteEventSourceMappingCommandInput) => new Sdk.DeleteEventSourceMappingCommand(_),
  deleteFunctionCodeSigningConfig: (_: Sdk.DeleteFunctionCodeSigningConfigCommandInput) => new Sdk.DeleteFunctionCodeSigningConfigCommand(_),
  deleteFunction: (_: Sdk.DeleteFunctionCommandInput) => new Sdk.DeleteFunctionCommand(_),
  deleteFunctionConcurrency: (_: Sdk.DeleteFunctionConcurrencyCommandInput) => new Sdk.DeleteFunctionConcurrencyCommand(_),
  deleteFunctionEventInvokeConfig: (_: Sdk.DeleteFunctionEventInvokeConfigCommandInput) => new Sdk.DeleteFunctionEventInvokeConfigCommand(_),
  deleteFunctionUrlConfig: (_: Sdk.DeleteFunctionUrlConfigCommandInput) => new Sdk.DeleteFunctionUrlConfigCommand(_),
  deleteLayerVersion: (_: Sdk.DeleteLayerVersionCommandInput) => new Sdk.DeleteLayerVersionCommand(_),
  deleteProvisionedConcurrencyConfig: (_: Sdk.DeleteProvisionedConcurrencyConfigCommandInput) => new Sdk.DeleteProvisionedConcurrencyConfigCommand(_),
  getAccountSettings: (_: Sdk.GetAccountSettingsCommandInput) => new Sdk.GetAccountSettingsCommand(_),
  getAlias: (_: Sdk.GetAliasCommandInput) => new Sdk.GetAliasCommand(_),
  getCodeSigningConfig: (_: Sdk.GetCodeSigningConfigCommandInput) => new Sdk.GetCodeSigningConfigCommand(_),
  getEventSourceMapping: (_: Sdk.GetEventSourceMappingCommandInput) => new Sdk.GetEventSourceMappingCommand(_),
  getFunctionCodeSigningConfig: (_: Sdk.GetFunctionCodeSigningConfigCommandInput) => new Sdk.GetFunctionCodeSigningConfigCommand(_),
  getFunction: (_: Sdk.GetFunctionCommandInput) => new Sdk.GetFunctionCommand(_),
  getFunctionConcurrency: (_: Sdk.GetFunctionConcurrencyCommandInput) => new Sdk.GetFunctionConcurrencyCommand(_),
  getFunctionConfiguration: (_: Sdk.GetFunctionConfigurationCommandInput) => new Sdk.GetFunctionConfigurationCommand(_),
  getFunctionEventInvokeConfig: (_: Sdk.GetFunctionEventInvokeConfigCommandInput) => new Sdk.GetFunctionEventInvokeConfigCommand(_),
  getFunctionRecursionConfig: (_: Sdk.GetFunctionRecursionConfigCommandInput) => new Sdk.GetFunctionRecursionConfigCommand(_),
  getFunctionUrlConfig: (_: Sdk.GetFunctionUrlConfigCommandInput) => new Sdk.GetFunctionUrlConfigCommand(_),
  getLayerVersionByArn: (_: Sdk.GetLayerVersionByArnCommandInput) => new Sdk.GetLayerVersionByArnCommand(_),
  getLayerVersion: (_: Sdk.GetLayerVersionCommandInput) => new Sdk.GetLayerVersionCommand(_),
  getLayerVersionPolicy: (_: Sdk.GetLayerVersionPolicyCommandInput) => new Sdk.GetLayerVersionPolicyCommand(_),
  getPolicy: (_: Sdk.GetPolicyCommandInput) => new Sdk.GetPolicyCommand(_),
  getProvisionedConcurrencyConfig: (_: Sdk.GetProvisionedConcurrencyConfigCommandInput) => new Sdk.GetProvisionedConcurrencyConfigCommand(_),
  getRuntimeManagementConfig: (_: Sdk.GetRuntimeManagementConfigCommandInput) => new Sdk.GetRuntimeManagementConfigCommand(_),
  invokeAsync: (_: Sdk.InvokeAsyncCommandInput) => new Sdk.InvokeAsyncCommand(_),
  invoke: (_: Sdk.InvokeCommandInput) => new Sdk.InvokeCommand(_),
  invokeWithResponseStream: (_: Sdk.InvokeWithResponseStreamCommandInput) => new Sdk.InvokeWithResponseStreamCommand(_),
  listAliases: (_: Sdk.ListAliasesCommandInput) => new Sdk.ListAliasesCommand(_),
  listCodeSigningConfigs: (_: Sdk.ListCodeSigningConfigsCommandInput) => new Sdk.ListCodeSigningConfigsCommand(_),
  listEventSourceMappings: (_: Sdk.ListEventSourceMappingsCommandInput) => new Sdk.ListEventSourceMappingsCommand(_),
  listFunctionEventInvokeConfigs: (_: Sdk.ListFunctionEventInvokeConfigsCommandInput) => new Sdk.ListFunctionEventInvokeConfigsCommand(_),
  listFunctionsByCodeSigningConfig: (_: Sdk.ListFunctionsByCodeSigningConfigCommandInput) => new Sdk.ListFunctionsByCodeSigningConfigCommand(_),
  listFunctions: (_: Sdk.ListFunctionsCommandInput) => new Sdk.ListFunctionsCommand(_),
  listFunctionUrlConfigs: (_: Sdk.ListFunctionUrlConfigsCommandInput) => new Sdk.ListFunctionUrlConfigsCommand(_),
  listLayers: (_: Sdk.ListLayersCommandInput) => new Sdk.ListLayersCommand(_),
  listLayerVersions: (_: Sdk.ListLayerVersionsCommandInput) => new Sdk.ListLayerVersionsCommand(_),
  listProvisionedConcurrencyConfigs: (_: Sdk.ListProvisionedConcurrencyConfigsCommandInput) => new Sdk.ListProvisionedConcurrencyConfigsCommand(_),
  listTags: (_: Sdk.ListTagsCommandInput) => new Sdk.ListTagsCommand(_),
  listVersionsByFunction: (_: Sdk.ListVersionsByFunctionCommandInput) => new Sdk.ListVersionsByFunctionCommand(_),
  publishLayerVersion: (_: Sdk.PublishLayerVersionCommandInput) => new Sdk.PublishLayerVersionCommand(_),
  publishVersion: (_: Sdk.PublishVersionCommandInput) => new Sdk.PublishVersionCommand(_),
  putFunctionCodeSigningConfig: (_: Sdk.PutFunctionCodeSigningConfigCommandInput) => new Sdk.PutFunctionCodeSigningConfigCommand(_),
  putFunctionConcurrency: (_: Sdk.PutFunctionConcurrencyCommandInput) => new Sdk.PutFunctionConcurrencyCommand(_),
  putFunctionEventInvokeConfig: (_: Sdk.PutFunctionEventInvokeConfigCommandInput) => new Sdk.PutFunctionEventInvokeConfigCommand(_),
  putFunctionRecursionConfig: (_: Sdk.PutFunctionRecursionConfigCommandInput) => new Sdk.PutFunctionRecursionConfigCommand(_),
  putProvisionedConcurrencyConfig: (_: Sdk.PutProvisionedConcurrencyConfigCommandInput) => new Sdk.PutProvisionedConcurrencyConfigCommand(_),
  putRuntimeManagementConfig: (_: Sdk.PutRuntimeManagementConfigCommandInput) => new Sdk.PutRuntimeManagementConfigCommand(_),
  removeLayerVersionPermission: (_: Sdk.RemoveLayerVersionPermissionCommandInput) => new Sdk.RemoveLayerVersionPermissionCommand(_),
  removePermission: (_: Sdk.RemovePermissionCommandInput) => new Sdk.RemovePermissionCommand(_),
  tagResource: (_: Sdk.TagResourceCommandInput) => new Sdk.TagResourceCommand(_),
  untagResource: (_: Sdk.UntagResourceCommandInput) => new Sdk.UntagResourceCommand(_),
  updateAlias: (_: Sdk.UpdateAliasCommandInput) => new Sdk.UpdateAliasCommand(_),
  updateCodeSigningConfig: (_: Sdk.UpdateCodeSigningConfigCommandInput) => new Sdk.UpdateCodeSigningConfigCommand(_),
  updateEventSourceMapping: (_: Sdk.UpdateEventSourceMappingCommandInput) => new Sdk.UpdateEventSourceMappingCommand(_),
  updateFunctionCode: (_: Sdk.UpdateFunctionCodeCommandInput) => new Sdk.UpdateFunctionCodeCommand(_),
  updateFunctionConfiguration: (_: Sdk.UpdateFunctionConfigurationCommandInput) => new Sdk.UpdateFunctionConfigurationCommand(_),
  updateFunctionEventInvokeConfig: (_: Sdk.UpdateFunctionEventInvokeConfigCommandInput) => new Sdk.UpdateFunctionEventInvokeConfigCommand(_),
  updateFunctionUrlConfig: (_: Sdk.UpdateFunctionUrlConfigCommandInput) => new Sdk.UpdateFunctionUrlConfigCommand(_),
} as Record<keyof LambdaClientApi, (_: unknown) => unknown>


const LambdaExceptionNames = [
  "LambdaServiceException", "InvalidParameterValueException", "PolicyLengthExceededException",
  "PreconditionFailedException", "ResourceConflictException", "ResourceNotFoundException",
  "ServiceException", "TooManyRequestsException", "CodeSigningConfigNotFoundException",
  "CodeStorageExceededException", "CodeVerificationFailedException", "InvalidCodeSignatureException",
  "ResourceInUseException", "ProvisionedConcurrencyConfigNotFoundException", "EC2AccessDeniedException",
  "EC2ThrottledException", "EC2UnexpectedException", "EFSIOException",
  "EFSMountConnectivityException", "EFSMountFailureException", "EFSMountTimeoutException",
  "ENILimitReachedException", "InvalidRequestContentException", "InvalidRuntimeException",
  "InvalidSecurityGroupIDException", "InvalidSubnetIDException", "InvalidZipFileException",
  "KMSAccessDeniedException", "KMSDisabledException", "KMSInvalidStateException",
  "KMSNotFoundException", "RecursiveInvocationException", "RequestTooLargeException",
  "ResourceNotReadyException", "SnapStartException", "SnapStartNotReadyException",
  "SnapStartTimeoutException", "SubnetIPAddressLimitReachedException", "UnsupportedMediaTypeException",
] as const;

export type LambdaExceptionName = typeof LambdaExceptionNames[number];

export class LambdaClientException extends Data.TaggedError("LambdaClientException")<
  {
    name: LambdaExceptionName;
    cause: Sdk.LambdaServiceException
  }
> { } {
}

export function recoverFromLambdaException<A, A2, E>(name: LambdaExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, LambdaClientException>) =>
    Effect.catchIf(
      effect,
      error => error._tag == "LambdaClientException" && error.name == name,
      error =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => Effect.succeed(recover))
        )
    )

}
