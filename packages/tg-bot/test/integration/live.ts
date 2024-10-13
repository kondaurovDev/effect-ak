import { NodeContext  } from "@effect/platform-node"
import { Layer } from "effect";

import { TgBotTokenProvider } from "../../src/api/token";
import { TgBotHttpClient } from "../../src/api";

const tokenProvider = 
  Layer.effect(
    TgBotTokenProvider,
    TgBotTokenProvider.fromEnv
  ).pipe(
    Layer.provide(NodeContext.layer)
  )

const tgBotHttpClient =
  TgBotHttpClient.Default.pipe(
    Layer.provide(NodeContext.layer)
  )

export const testEnv = 
  Layer.mergeAll(
    tokenProvider,
    tgBotHttpClient
  )
