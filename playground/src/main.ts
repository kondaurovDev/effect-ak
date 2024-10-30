import { HttpApiBuilder, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { ConfigProvider, Layer, Logger, LogLevel } from "effect"
import { createServer } from "node:http"
import { setConfigProvider } from "effect/Layer"

import integrationConfig from "../../packages/ai/integration-config.json"
import { BackendApi } from "./api/implementation.js"

const nodeHttpServer = (
  port: number
) =>
  NodeHttpServer.layer(createServer, { port });

const configProvider = 
  setConfigProvider(
    ConfigProvider.fromJson({
      vueComponentsDir: __dirname + "/../pages",
      vueComponentsOutDir: __dirname + "/../.out",
      openai: {
        token: integrationConfig.openai_token
      },
      anthropic: {
        token: integrationConfig.anthropic_token
      },
      deepgram: {
        token: integrationConfig.deepgram_token
      }
    })
  )

const HttpLive =
  HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
    Layer.provide(HttpApiBuilder.middlewareCors()),
    Layer.provide(BackendApi.live),
    HttpServer.withLogAddress,
    Layer.provide(nodeHttpServer(3000))
  ).pipe(
    Layer.provide(configProvider)
  )

Layer.launch(HttpLive).pipe(NodeRuntime.runMain)
