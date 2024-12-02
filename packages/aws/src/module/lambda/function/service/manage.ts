import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { LambdaClientService, recoverFromLambdaException } from "#/clients/lambda.js";
import { LambdaFunctionConfigurationManageService } from "#/module/lambda/function-configuration/service/_export.js";
import { LambdaFunctionFactoryService } from "./factory.js";
import { IamRoleFactoryService } from "#/module/iam/index.js";
import * as S from "../schema/_export.js";
import { CoreConfigurationProviderService } from "#/core/index.js";

export class LambdaFunctionManageService
  extends Effect.Service<LambdaFunctionManageService>()("LambdaFunctionManageService", {
    effect:
      Effect.gen(function* () {

        const { resourceTagsMap } = yield* CoreConfigurationProviderService;

        const $ = {
          client: yield* LambdaClientService,
          configuration: yield* LambdaFunctionConfigurationManageService,
          factory: yield* LambdaFunctionFactoryService,
          iam: yield* IamRoleFactoryService
        };

        const updateFunctionCode =
          (input: {
            functionName: string,
            code: S.LambdaFunctionSourceCode
          }) =>
            Effect.gen(function* () {

              const response =
                yield* pipe(
                  $.client.execute(
                    "updateFunctionCode",
                    {
                      FunctionName: input.functionName,
                      ZipFile: yield* $.factory.makeCodeZipArchive(input.code)
                    }
                  ),
                ).pipe(
                  recoverFromLambdaException("ResourceNotFoundException", undefined)
                );

              if (!response) {
                yield* Effect.logWarning("Function does not exist");
                return false;
              }

              yield* Effect.logDebug("Function code has been updated");

              return true;

            });

        const upsertFunction =
          (input: S.LambdaFunctionUpsertCommand) =>
            Effect.gen(function* () {

              const currentConfiguration =
                yield* $.configuration.$.view.get({
                  functionName: input.functionName,
                  beforeDecode: _ => ({
                    $metadata: _.$metadata,
                    CodeSize: _.CodeSize,
                  })
                });

              const code = yield* $.factory.makeCodeZipArchive(input.code);

              const role = yield* $.iam.makeRole(input);

              if (!currentConfiguration) {
                const response =
                  yield* $.client.execute(
                    "createFunction",
                    {
                      FunctionName: input.functionName,
                      Code: {
                        ZipFile: code
                      },
                      Role: role.arn,
                      Runtime: input.runtime,
                      ...yield* $.configuration.$.factory.make(input.configuration),
                      Tags: resourceTagsMap
                    }
                  );

                yield* Effect.logInfo("Function has been created", response.$metadata.httpStatusCode);
                return true;
              }

              const currentCodeSize = code.byteLength;

              if (currentConfiguration.CodeSize != currentCodeSize) {
                yield* $.client.execute(
                  "updateFunctionCode",
                  {
                    FunctionName: input.functionName,
                    ZipFile: code
                  }
                );
                yield* Effect.sleep("10 seconds");
              }

              yield* $.configuration.syncFunctionConfiguration({
                functionName: input.functionName,
                ...input.configuration
              });

              return true;

            });

        return {
          $, updateFunctionCode, upsertFunction
        } as const;

      }),

    dependencies: [
      LambdaClientService.Default,
      LambdaFunctionConfigurationManageService.Default,
      LambdaFunctionFactoryService.Default,
      IamRoleFactoryService.Default,
      CoreConfigurationProviderService.Default
    ]
  }) { }
