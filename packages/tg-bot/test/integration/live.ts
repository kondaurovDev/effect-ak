import { NodeContext  } from "@effect/platform-node"
import { Layer } from "effect";

import { TgBotChat } from "../../src/module";
import { TgBotTokenProvider } from "../../src/api/config-provider";

export const testEnv = 
  Layer.mergeAll(
    NodeContext.layer,
    TgBotChat.TgChatService.Default
  ).pipe(
    Layer.provide([ 
      TgBotTokenProvider.fromConfig,
      NodeContext.layer
    ])
  )
