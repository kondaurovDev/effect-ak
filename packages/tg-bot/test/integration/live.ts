import { NodeContext  } from "@effect/platform-node"
import { Layer } from "effect";

import { TgBotHttpClient } from "../../src/api";

const tgBotHttpClient =
  TgBotHttpClient.Default.pipe(
    Layer.provide(NodeContext.layer)
  )

export const testEnv = 
  Layer.mergeAll(
    NodeContext.layer,
    tgBotHttpClient
  )
