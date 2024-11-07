import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as Array from "effect/Array";
import * as Context from "effect/Context";
import * as S from "effect/Schema";
import * as Ref from "effect/Ref";

import { MethodEffectOrPromiseResponse, TgBotHttpClient } from "../api/http-client.js";
import { OriginUpdateEvent, MessageUpdate, MessageUpdateEvent, ChatId } from "../module/chat/index.js";
import { TgBotService } from "./bot-service.js";

export type MessageHandler =
  (input: MessageHandlerContext) => unknown

export type MessageHandlerContext = {
  message: MessageUpdate,
  currentChatId: ChatId,
  service: Context.Tag.Service<typeof TgBotService>
}

export class PollingService
  extends Effect.Service<PollingService>()("PollingService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* TgBotHttpClient;
        const service = yield* TgBotService;

        const lastUpdateIdRef =
          yield* Ref.make<number | undefined>(undefined);

        const emptyResponsesRef =
          yield* Ref.make(0);

        const getLastUpdatesEffect =
          Effect.gen(function* () {

            const lastUpdateId = yield* Ref.get(lastUpdateIdRef);
            const emptyResponses = yield* Ref.get(emptyResponsesRef);

            if (emptyResponses == 3) {
              yield* Effect.fail("Got 3 empty responses, quitting")
            }

            yield* Effect.logInfo("Getting updates", { lastUpdateId, emptyResponses });

            const updates =
              yield* httpClient.executeMethod({
                path: "/getUpdates",
                responseSchema: OriginUpdateEvent.pipe(S.Array),
                payload: {
                  limit: 10,
                  offset: lastUpdateId,
                  timeout: 10
                }
              }).effect

            yield* Effect.logInfo("Got updates", { number: updates.length })

            const ids = updates.map(_ => _.update_id).sort();
            if (Array.isNonEmptyArray(ids)) {
              yield* Effect.logInfo("setting last update id", ids.at(-1));
              yield* Ref.update(lastUpdateIdRef, () => Array.lastNonEmpty(ids) + 1);
              yield* Ref.update(emptyResponsesRef, () => 0);
            } else {
              yield* Ref.update(emptyResponsesRef, _ => _ + 1);
            }

            yield* Effect.logDebug(`Got updates`, {
              total: updates.length,
              lastUpdateId
            });

            return updates;

          });

        const handlerEffect =
          (messageHandler: MessageHandler) =>
            Effect.gen(function* () {

              yield* Effect.logInfo("Listening Telegram bot updates...");

              const handleBatchEffect =
                pipe(
                  getLastUpdatesEffect,
                  Effect.andThen(updates =>
                    Effect.forEach(updates, update => {
                      const messageUpdate = MessageUpdateEvent.fromOriginUpdateEvent(update);

                      if (messageUpdate == null) {
                        return pipe(
                          Effect.logInfo("Got non-message update", update),
                          Effect.andThen(undefined)
                        )
                      };

                      let handlerResult: any;
                      try {
                        handlerResult =
                          messageHandler({
                            message: messageUpdate.update,
                            currentChatId: messageUpdate.chatId,
                            service
                          })
                      } catch (error) {
                        return Effect.die(error);
                      }

                      console.info("handler result", handlerResult);

                      if (handlerResult instanceof Promise) { //unwrap Promise
                        return pipe(
                          Effect.tryPromise(() => handlerResult),
                          Effect.andThen(_ => {
                            if (Effect.isEffect(_)) {
                              return _ as Effect.Effect<unknown, unknown, never>
                            } else if (_ instanceof Promise) {
                              return Effect.tryPromise(() => _)
                            } else if (_ instanceof MethodEffectOrPromiseResponse) {
                              return _.effect
                            }
                          })
                        )
                      }

                      if (Effect.isEffect(handlerResult)) {
                        return handlerResult as Effect.Effect<unknown, unknown, never>;  // just wait for effect resolving
                      }

                      if (handlerResult instanceof MethodEffectOrPromiseResponse) {
                        return handlerResult.effect; // just wait for effect resolving
                      }

                      return pipe(
                        Effect.logDebug("discarding message handler result", typeof handlerResult),
                        Effect.andThen(Effect.void)
                      );

                    })
                  )
                )

              // run infinitely in global scope until first error
              return yield* pipe(
                handleBatchEffect,
                Effect.andThen(Effect.sleep("2 seconds")), // batch window
                Effect.forever,
                Effect.forkDaemon
              );

            });

        return {
          handlerEffect
        } as const

      }),

    dependencies: [
      TgBotService.Default,
      TgBotHttpClient.Default
    ]
  }) { }
