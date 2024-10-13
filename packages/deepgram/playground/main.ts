import { HttpApiBuilder, HttpMiddleware, HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { createServer } from "node:http"
import { BackendApi } from "./api/main"

const nodeHttpServer = (
  port: number
) =>
  NodeHttpServer.layer(createServer, { port });

const router = 
  HttpRouter.empty.pipe(
    HttpRouter.get("/", HttpServerResponse.file(__dirname + "/page/transcribe.html"))
  ).pipe(
    HttpServer.serve(),
    HttpServer.withLogAddress,
    Layer.provide(nodeHttpServer(8080))
  ) 

const HttpLive =
  HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
    Layer.provide(HttpApiBuilder.middlewareCors()),
    Layer.provide(BackendApi.live),
    HttpServer.withLogAddress,
    Layer.provide(nodeHttpServer(3000)),
    Layer.provide(router)
  )

Layer.launch(HttpLive).pipe(NodeRuntime.runMain)
