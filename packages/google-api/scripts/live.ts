import { ConfigProvider, Layer } from "effect"
import { NodeContext } from "@effect/platform-node"

import { GoogleOAuth2ClientCredentialsProvider, OAuth2Service } from "../src/api"
import { AccessTokenFromFile } from "../src/misc"
import integrationConfig from "../integration-config.json"
import { configPathConfigKey, moduleName } from "../src/const"

export const live =
  Layer.mergeAll(
    OAuth2Service.Default,
    AccessTokenFromFile.Default,
    NodeContext.layer
  ).pipe(
    Layer.provide([
      GoogleOAuth2ClientCredentialsProvider.fromConfig(),
      NodeContext.layer,
      Layer.setConfigProvider(
        ConfigProvider.fromJson({
          [ moduleName ]: {
            ...integrationConfig,
            [ configPathConfigKey ]: __dirname + "/../integration-config.json"
          }
        })
      )
    ])
  )
