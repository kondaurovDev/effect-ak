import * as Effect from "effect/Effect";
import { PublishLayerVersionCommand } from "@aws-sdk/client-lambda";

import { ZipService } from "../../../../common/index.js";
import { AwsLambdaClient } from "../../client.js";
import { FunctionLayer } from "../types.js";

export class LambdaLayerPublishService
  extends Effect.Service<LambdaLayerPublishService>()("LambdaLayerPublishService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* AwsLambdaClient;

        const publishLayer = (
          layer: FunctionLayer
        ) =>
          Effect.gen(function* () {
    
            const zipService = yield* ZipService;
    
            const result =
              yield* lambda.executeMethod(
                `publish layer ${layer.name}`, _ =>
                _.send(
                  new PublishLayerVersionCommand({
                    LayerName: layer.name,
                    CompatibleRuntimes: ["nodejs20.x"],
                    CompatibleArchitectures: ["arm64"],
                    Content: {
                      ZipFile: new Uint8Array()
                    }
                  })
                )
              );
    
            return result;
    
          })
    
    
        return {
          publishLayer
        } as const;

      }),
      
      dependencies: [
        AwsLambdaClient.Default
      ]
      
    }) {}
