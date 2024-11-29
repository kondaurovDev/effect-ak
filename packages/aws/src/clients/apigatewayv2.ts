import * as Sdk from "@aws-sdk/client-apigatewayv2";
import { Effect, Data, pipe, Cause } from "effect";
import { AwsRegionConfig } from "#core/index.js";

// *****  GENERATED CODE *****
export class Apigatewayv2ClientService extends
  Effect.Service<Apigatewayv2ClientService>()("Apigatewayv2ClientService", {
    scoped: Effect.gen(function*() {
      const region = yield* AwsRegionConfig;

      yield* Effect.logDebug("Creating aws client", { client: "Apigatewayv2" });

      const client = new Sdk.ApiGatewayV2Client({ region });

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "Apigatewayv2" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof Apigatewayv2ClientApi>(
        name: M,
        input: Parameters<Apigatewayv2ClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(Apigatewayv2CommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, `Command "${name}" is unknown`),
          Effect.tap(Effect.logDebug(`executing '${name}'`, input)),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<Apigatewayv2ClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.ApiGatewayV2ServiceException ?
              new Apigatewayv2ClientException({
                name: error.cause.name as Apigatewayv2ExceptionName,
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

export type Apigatewayv2MethodInput<M extends keyof Apigatewayv2ClientApi> = Parameters<Apigatewayv2ClientApi[M]>[0];

export interface Apigatewayv2ClientApi {
  createApi(_: Sdk.CreateApiCommandInput): Sdk.CreateApiCommandOutput;
  createApiMapping(_: Sdk.CreateApiMappingCommandInput): Sdk.CreateApiMappingCommandOutput;
  createAuthorizer(_: Sdk.CreateAuthorizerCommandInput): Sdk.CreateAuthorizerCommandOutput;
  createDeployment(_: Sdk.CreateDeploymentCommandInput): Sdk.CreateDeploymentCommandOutput;
  createDomainName(_: Sdk.CreateDomainNameCommandInput): Sdk.CreateDomainNameCommandOutput;
  createIntegration(_: Sdk.CreateIntegrationCommandInput): Sdk.CreateIntegrationCommandOutput;
  createIntegrationResponse(_: Sdk.CreateIntegrationResponseCommandInput): Sdk.CreateIntegrationResponseCommandOutput;
  createModel(_: Sdk.CreateModelCommandInput): Sdk.CreateModelCommandOutput;
  createRoute(_: Sdk.CreateRouteCommandInput): Sdk.CreateRouteCommandOutput;
  createRouteResponse(_: Sdk.CreateRouteResponseCommandInput): Sdk.CreateRouteResponseCommandOutput;
  createStage(_: Sdk.CreateStageCommandInput): Sdk.CreateStageCommandOutput;
  createVpcLink(_: Sdk.CreateVpcLinkCommandInput): Sdk.CreateVpcLinkCommandOutput;
  deleteAccessLogSettings(_: Sdk.DeleteAccessLogSettingsCommandInput): Sdk.DeleteAccessLogSettingsCommandOutput;
  deleteApi(_: Sdk.DeleteApiCommandInput): Sdk.DeleteApiCommandOutput;
  deleteApiMapping(_: Sdk.DeleteApiMappingCommandInput): Sdk.DeleteApiMappingCommandOutput;
  deleteAuthorizer(_: Sdk.DeleteAuthorizerCommandInput): Sdk.DeleteAuthorizerCommandOutput;
  deleteCorsConfiguration(_: Sdk.DeleteCorsConfigurationCommandInput): Sdk.DeleteCorsConfigurationCommandOutput;
  deleteDeployment(_: Sdk.DeleteDeploymentCommandInput): Sdk.DeleteDeploymentCommandOutput;
  deleteDomainName(_: Sdk.DeleteDomainNameCommandInput): Sdk.DeleteDomainNameCommandOutput;
  deleteIntegration(_: Sdk.DeleteIntegrationCommandInput): Sdk.DeleteIntegrationCommandOutput;
  deleteIntegrationResponse(_: Sdk.DeleteIntegrationResponseCommandInput): Sdk.DeleteIntegrationResponseCommandOutput;
  deleteModel(_: Sdk.DeleteModelCommandInput): Sdk.DeleteModelCommandOutput;
  deleteRoute(_: Sdk.DeleteRouteCommandInput): Sdk.DeleteRouteCommandOutput;
  deleteRouteRequestParameter(_: Sdk.DeleteRouteRequestParameterCommandInput): Sdk.DeleteRouteRequestParameterCommandOutput;
  deleteRouteResponse(_: Sdk.DeleteRouteResponseCommandInput): Sdk.DeleteRouteResponseCommandOutput;
  deleteRouteSettings(_: Sdk.DeleteRouteSettingsCommandInput): Sdk.DeleteRouteSettingsCommandOutput;
  deleteStage(_: Sdk.DeleteStageCommandInput): Sdk.DeleteStageCommandOutput;
  deleteVpcLink(_: Sdk.DeleteVpcLinkCommandInput): Sdk.DeleteVpcLinkCommandOutput;
  exportApi(_: Sdk.ExportApiCommandInput): Sdk.ExportApiCommandOutput;
  getApi(_: Sdk.GetApiCommandInput): Sdk.GetApiCommandOutput;
  getApiMapping(_: Sdk.GetApiMappingCommandInput): Sdk.GetApiMappingCommandOutput;
  getApiMappings(_: Sdk.GetApiMappingsCommandInput): Sdk.GetApiMappingsCommandOutput;
  getApis(_: Sdk.GetApisCommandInput): Sdk.GetApisCommandOutput;
  getAuthorizer(_: Sdk.GetAuthorizerCommandInput): Sdk.GetAuthorizerCommandOutput;
  getAuthorizers(_: Sdk.GetAuthorizersCommandInput): Sdk.GetAuthorizersCommandOutput;
  getDeployment(_: Sdk.GetDeploymentCommandInput): Sdk.GetDeploymentCommandOutput;
  getDeployments(_: Sdk.GetDeploymentsCommandInput): Sdk.GetDeploymentsCommandOutput;
  getDomainName(_: Sdk.GetDomainNameCommandInput): Sdk.GetDomainNameCommandOutput;
  getDomainNames(_: Sdk.GetDomainNamesCommandInput): Sdk.GetDomainNamesCommandOutput;
  getIntegration(_: Sdk.GetIntegrationCommandInput): Sdk.GetIntegrationCommandOutput;
  getIntegrationResponse(_: Sdk.GetIntegrationResponseCommandInput): Sdk.GetIntegrationResponseCommandOutput;
  getIntegrationResponses(_: Sdk.GetIntegrationResponsesCommandInput): Sdk.GetIntegrationResponsesCommandOutput;
  getIntegrations(_: Sdk.GetIntegrationsCommandInput): Sdk.GetIntegrationsCommandOutput;
  getModel(_: Sdk.GetModelCommandInput): Sdk.GetModelCommandOutput;
  getModels(_: Sdk.GetModelsCommandInput): Sdk.GetModelsCommandOutput;
  getModelTemplate(_: Sdk.GetModelTemplateCommandInput): Sdk.GetModelTemplateCommandOutput;
  getRoute(_: Sdk.GetRouteCommandInput): Sdk.GetRouteCommandOutput;
  getRouteResponse(_: Sdk.GetRouteResponseCommandInput): Sdk.GetRouteResponseCommandOutput;
  getRouteResponses(_: Sdk.GetRouteResponsesCommandInput): Sdk.GetRouteResponsesCommandOutput;
  getRoutes(_: Sdk.GetRoutesCommandInput): Sdk.GetRoutesCommandOutput;
  getStage(_: Sdk.GetStageCommandInput): Sdk.GetStageCommandOutput;
  getStages(_: Sdk.GetStagesCommandInput): Sdk.GetStagesCommandOutput;
  getTags(_: Sdk.GetTagsCommandInput): Sdk.GetTagsCommandOutput;
  getVpcLink(_: Sdk.GetVpcLinkCommandInput): Sdk.GetVpcLinkCommandOutput;
  getVpcLinks(_: Sdk.GetVpcLinksCommandInput): Sdk.GetVpcLinksCommandOutput;
  importApi(_: Sdk.ImportApiCommandInput): Sdk.ImportApiCommandOutput;
  reimportApi(_: Sdk.ReimportApiCommandInput): Sdk.ReimportApiCommandOutput;
  resetAuthorizersCache(_: Sdk.ResetAuthorizersCacheCommandInput): Sdk.ResetAuthorizersCacheCommandOutput;
  tagResource(_: Sdk.TagResourceCommandInput): Sdk.TagResourceCommandOutput;
  untagResource(_: Sdk.UntagResourceCommandInput): Sdk.UntagResourceCommandOutput;
  updateApi(_: Sdk.UpdateApiCommandInput): Sdk.UpdateApiCommandOutput;
  updateApiMapping(_: Sdk.UpdateApiMappingCommandInput): Sdk.UpdateApiMappingCommandOutput;
  updateAuthorizer(_: Sdk.UpdateAuthorizerCommandInput): Sdk.UpdateAuthorizerCommandOutput;
  updateDeployment(_: Sdk.UpdateDeploymentCommandInput): Sdk.UpdateDeploymentCommandOutput;
  updateDomainName(_: Sdk.UpdateDomainNameCommandInput): Sdk.UpdateDomainNameCommandOutput;
  updateIntegration(_: Sdk.UpdateIntegrationCommandInput): Sdk.UpdateIntegrationCommandOutput;
  updateIntegrationResponse(_: Sdk.UpdateIntegrationResponseCommandInput): Sdk.UpdateIntegrationResponseCommandOutput;
  updateModel(_: Sdk.UpdateModelCommandInput): Sdk.UpdateModelCommandOutput;
  updateRoute(_: Sdk.UpdateRouteCommandInput): Sdk.UpdateRouteCommandOutput;
  updateRouteResponse(_: Sdk.UpdateRouteResponseCommandInput): Sdk.UpdateRouteResponseCommandOutput;
  updateStage(_: Sdk.UpdateStageCommandInput): Sdk.UpdateStageCommandOutput;
  updateVpcLink(_: Sdk.UpdateVpcLinkCommandInput): Sdk.UpdateVpcLinkCommandOutput;
}


const Apigatewayv2CommandFactory = {
  createApi: (_: Sdk.CreateApiCommandInput) => new Sdk.CreateApiCommand(_),
  createApiMapping: (_: Sdk.CreateApiMappingCommandInput) => new Sdk.CreateApiMappingCommand(_),
  createAuthorizer: (_: Sdk.CreateAuthorizerCommandInput) => new Sdk.CreateAuthorizerCommand(_),
  createDeployment: (_: Sdk.CreateDeploymentCommandInput) => new Sdk.CreateDeploymentCommand(_),
  createDomainName: (_: Sdk.CreateDomainNameCommandInput) => new Sdk.CreateDomainNameCommand(_),
  createIntegration: (_: Sdk.CreateIntegrationCommandInput) => new Sdk.CreateIntegrationCommand(_),
  createIntegrationResponse: (_: Sdk.CreateIntegrationResponseCommandInput) => new Sdk.CreateIntegrationResponseCommand(_),
  createModel: (_: Sdk.CreateModelCommandInput) => new Sdk.CreateModelCommand(_),
  createRoute: (_: Sdk.CreateRouteCommandInput) => new Sdk.CreateRouteCommand(_),
  createRouteResponse: (_: Sdk.CreateRouteResponseCommandInput) => new Sdk.CreateRouteResponseCommand(_),
  createStage: (_: Sdk.CreateStageCommandInput) => new Sdk.CreateStageCommand(_),
  createVpcLink: (_: Sdk.CreateVpcLinkCommandInput) => new Sdk.CreateVpcLinkCommand(_),
  deleteAccessLogSettings: (_: Sdk.DeleteAccessLogSettingsCommandInput) => new Sdk.DeleteAccessLogSettingsCommand(_),
  deleteApi: (_: Sdk.DeleteApiCommandInput) => new Sdk.DeleteApiCommand(_),
  deleteApiMapping: (_: Sdk.DeleteApiMappingCommandInput) => new Sdk.DeleteApiMappingCommand(_),
  deleteAuthorizer: (_: Sdk.DeleteAuthorizerCommandInput) => new Sdk.DeleteAuthorizerCommand(_),
  deleteCorsConfiguration: (_: Sdk.DeleteCorsConfigurationCommandInput) => new Sdk.DeleteCorsConfigurationCommand(_),
  deleteDeployment: (_: Sdk.DeleteDeploymentCommandInput) => new Sdk.DeleteDeploymentCommand(_),
  deleteDomainName: (_: Sdk.DeleteDomainNameCommandInput) => new Sdk.DeleteDomainNameCommand(_),
  deleteIntegration: (_: Sdk.DeleteIntegrationCommandInput) => new Sdk.DeleteIntegrationCommand(_),
  deleteIntegrationResponse: (_: Sdk.DeleteIntegrationResponseCommandInput) => new Sdk.DeleteIntegrationResponseCommand(_),
  deleteModel: (_: Sdk.DeleteModelCommandInput) => new Sdk.DeleteModelCommand(_),
  deleteRoute: (_: Sdk.DeleteRouteCommandInput) => new Sdk.DeleteRouteCommand(_),
  deleteRouteRequestParameter: (_: Sdk.DeleteRouteRequestParameterCommandInput) => new Sdk.DeleteRouteRequestParameterCommand(_),
  deleteRouteResponse: (_: Sdk.DeleteRouteResponseCommandInput) => new Sdk.DeleteRouteResponseCommand(_),
  deleteRouteSettings: (_: Sdk.DeleteRouteSettingsCommandInput) => new Sdk.DeleteRouteSettingsCommand(_),
  deleteStage: (_: Sdk.DeleteStageCommandInput) => new Sdk.DeleteStageCommand(_),
  deleteVpcLink: (_: Sdk.DeleteVpcLinkCommandInput) => new Sdk.DeleteVpcLinkCommand(_),
  exportApi: (_: Sdk.ExportApiCommandInput) => new Sdk.ExportApiCommand(_),
  getApi: (_: Sdk.GetApiCommandInput) => new Sdk.GetApiCommand(_),
  getApiMapping: (_: Sdk.GetApiMappingCommandInput) => new Sdk.GetApiMappingCommand(_),
  getApiMappings: (_: Sdk.GetApiMappingsCommandInput) => new Sdk.GetApiMappingsCommand(_),
  getApis: (_: Sdk.GetApisCommandInput) => new Sdk.GetApisCommand(_),
  getAuthorizer: (_: Sdk.GetAuthorizerCommandInput) => new Sdk.GetAuthorizerCommand(_),
  getAuthorizers: (_: Sdk.GetAuthorizersCommandInput) => new Sdk.GetAuthorizersCommand(_),
  getDeployment: (_: Sdk.GetDeploymentCommandInput) => new Sdk.GetDeploymentCommand(_),
  getDeployments: (_: Sdk.GetDeploymentsCommandInput) => new Sdk.GetDeploymentsCommand(_),
  getDomainName: (_: Sdk.GetDomainNameCommandInput) => new Sdk.GetDomainNameCommand(_),
  getDomainNames: (_: Sdk.GetDomainNamesCommandInput) => new Sdk.GetDomainNamesCommand(_),
  getIntegration: (_: Sdk.GetIntegrationCommandInput) => new Sdk.GetIntegrationCommand(_),
  getIntegrationResponse: (_: Sdk.GetIntegrationResponseCommandInput) => new Sdk.GetIntegrationResponseCommand(_),
  getIntegrationResponses: (_: Sdk.GetIntegrationResponsesCommandInput) => new Sdk.GetIntegrationResponsesCommand(_),
  getIntegrations: (_: Sdk.GetIntegrationsCommandInput) => new Sdk.GetIntegrationsCommand(_),
  getModel: (_: Sdk.GetModelCommandInput) => new Sdk.GetModelCommand(_),
  getModels: (_: Sdk.GetModelsCommandInput) => new Sdk.GetModelsCommand(_),
  getModelTemplate: (_: Sdk.GetModelTemplateCommandInput) => new Sdk.GetModelTemplateCommand(_),
  getRoute: (_: Sdk.GetRouteCommandInput) => new Sdk.GetRouteCommand(_),
  getRouteResponse: (_: Sdk.GetRouteResponseCommandInput) => new Sdk.GetRouteResponseCommand(_),
  getRouteResponses: (_: Sdk.GetRouteResponsesCommandInput) => new Sdk.GetRouteResponsesCommand(_),
  getRoutes: (_: Sdk.GetRoutesCommandInput) => new Sdk.GetRoutesCommand(_),
  getStage: (_: Sdk.GetStageCommandInput) => new Sdk.GetStageCommand(_),
  getStages: (_: Sdk.GetStagesCommandInput) => new Sdk.GetStagesCommand(_),
  getTags: (_: Sdk.GetTagsCommandInput) => new Sdk.GetTagsCommand(_),
  getVpcLink: (_: Sdk.GetVpcLinkCommandInput) => new Sdk.GetVpcLinkCommand(_),
  getVpcLinks: (_: Sdk.GetVpcLinksCommandInput) => new Sdk.GetVpcLinksCommand(_),
  importApi: (_: Sdk.ImportApiCommandInput) => new Sdk.ImportApiCommand(_),
  reimportApi: (_: Sdk.ReimportApiCommandInput) => new Sdk.ReimportApiCommand(_),
  resetAuthorizersCache: (_: Sdk.ResetAuthorizersCacheCommandInput) => new Sdk.ResetAuthorizersCacheCommand(_),
  tagResource: (_: Sdk.TagResourceCommandInput) => new Sdk.TagResourceCommand(_),
  untagResource: (_: Sdk.UntagResourceCommandInput) => new Sdk.UntagResourceCommand(_),
  updateApi: (_: Sdk.UpdateApiCommandInput) => new Sdk.UpdateApiCommand(_),
  updateApiMapping: (_: Sdk.UpdateApiMappingCommandInput) => new Sdk.UpdateApiMappingCommand(_),
  updateAuthorizer: (_: Sdk.UpdateAuthorizerCommandInput) => new Sdk.UpdateAuthorizerCommand(_),
  updateDeployment: (_: Sdk.UpdateDeploymentCommandInput) => new Sdk.UpdateDeploymentCommand(_),
  updateDomainName: (_: Sdk.UpdateDomainNameCommandInput) => new Sdk.UpdateDomainNameCommand(_),
  updateIntegration: (_: Sdk.UpdateIntegrationCommandInput) => new Sdk.UpdateIntegrationCommand(_),
  updateIntegrationResponse: (_: Sdk.UpdateIntegrationResponseCommandInput) => new Sdk.UpdateIntegrationResponseCommand(_),
  updateModel: (_: Sdk.UpdateModelCommandInput) => new Sdk.UpdateModelCommand(_),
  updateRoute: (_: Sdk.UpdateRouteCommandInput) => new Sdk.UpdateRouteCommand(_),
  updateRouteResponse: (_: Sdk.UpdateRouteResponseCommandInput) => new Sdk.UpdateRouteResponseCommand(_),
  updateStage: (_: Sdk.UpdateStageCommandInput) => new Sdk.UpdateStageCommand(_),
  updateVpcLink: (_: Sdk.UpdateVpcLinkCommandInput) => new Sdk.UpdateVpcLinkCommand(_),
} as Record<keyof Apigatewayv2ClientApi, (_: unknown) => unknown>


const Apigatewayv2ExceptionNames = [
  "ApiGatewayV2ServiceException", "AccessDeniedException", "BadRequestException",
  "ConflictException", "NotFoundException", "TooManyRequestsException",
] as const;

export type Apigatewayv2ExceptionName = typeof Apigatewayv2ExceptionNames[number];

export class Apigatewayv2ClientException extends Data.TaggedError("Apigatewayv2ClientException")<
  {
    name: Apigatewayv2ExceptionName;
    cause: Sdk.ApiGatewayV2ServiceException
  }
> { } {
}

export function recoverFromApigatewayv2Exception<A, A2, E>(name: Apigatewayv2ExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, Apigatewayv2ClientException>) =>
    Effect.catchIf(
      effect,
      error => error._tag == "Apigatewayv2ClientException" && error.name == name,
      error =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => Effect.succeed(recover))
        )
    )

}
