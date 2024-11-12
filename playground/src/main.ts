import { HttpApiBuilder, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { ConfigProvider, Layer } from "effect"
import { setConfigProvider } from "effect/Layer"
import { LogLevelConfigFromEnv } from "@effect-ak/misc"
import { createServer } from "node:http"

import integrationConfig from "../../packages/ai/integration-config.json"
import { httpApiLive } from "./api/layer.js"

const nodeHttpServer = (
  port: number
) =>
  NodeHttpServer.layer(createServer, { port });

const configProvider = 
  setConfigProvider(
    ConfigProvider.fromJson({
      "effect-ak-ai": {
        "openai-token": integrationConfig["effect-ak-ai_openai-token"],
        "anthropic-token": integrationConfig["effect-ak-ai_anthropic-token"],
        "deepgram-token": integrationConfig["effect-ak-ai_deepgram-token"],
        "stabilityai-token": integrationConfig["effect-ak-ai_stabilityai-token"],
        "output-dir": __dirname + "/../.out/ai/",
      },
      LOG_LEVEL: "debug"
    })
  );

const HttpLive =
  HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
    Layer.provide(HttpApiBuilder.middlewareCors()),
    Layer.provide(httpApiLive),
    Layer.provide(LogLevelConfigFromEnv),
    HttpServer.withLogAddress,
    Layer.provide(nodeHttpServer(3000))
  ).pipe(
    Layer.provide(configProvider)
  );

Layer.launch(HttpLive).pipe(NodeRuntime.runMain);
