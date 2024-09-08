import { Layer } from "effect";
import { CompletionLive } from "./completion/service.js";
import { OpenaiRestClientLive } from "./client.js";

export const ChatGptLive =
  Layer.mergeAll(
    OpenaiRestClientLive,
    CompletionLive,
  ).pipe(
    Layer.provide(OpenaiRestClientLive)
  )