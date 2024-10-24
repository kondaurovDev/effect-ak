import { ConfigProvider, Layer } from "effect"
import { NodeContext } from "@effect/platform-node"

import { OAuth2Service } from "../src/api"
import { AccessTokenFromFile, configKeys } from "../src/misc"
import integrationConfig from "../integration-config.json"

export const live =
  Layer.mergeAll(
    OAuth2Service.Default,
    AccessTokenFromFile.Default,
    NodeContext.layer
  ).pipe(
    Layer.provide([
      NodeContext.layer,
      Layer.setConfigProvider(
        ConfigProvider.fromJson({
          efkitGoogle: integrationConfig,
          [`${configKeys.configPath}`]: __dirname + "/../integration-config.json"
        })
      )
    ])
  )
