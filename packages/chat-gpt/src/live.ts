import { Layer } from "effect";
import { TextService } from "./text/service.js";
import { BaseEndpoint } from "./api/index.js";

export const ChatGptLive =
  Layer.mergeAll(
    BaseEndpoint.live,
    TextService.live,
  )
