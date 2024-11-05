import { Context, Effect, pipe, Ref, Schema as S } from "effect";

import { TgBotHttpClient } from "../api/http-client.js";

import { OriginUpdateEvent, MessageUpdate, MessageUpdateEvent, ChatId } from "../module/chat/index.js";
import { TgBotService } from "../module/main.js";

export type MessageHandler =
  (_: {
    message: MessageUpdate,
    currentChatId: ChatId,
    service: Context.Tag.Service<typeof TgBotService>
  }) => unknown

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
              yield* httpClient.executeMethod(
                "/getUpdates",
                {
                  limit: 10,
                  offset: lastUpdateId,
                  timeout: 10
                },
                OriginUpdateEvent.pipe(S.Array)
              );

            yield* Effect.logInfo("Got updates", { number: updates.length })

            const id = updates.at(-1)?.update_id;
            if (id) {
              yield* Effect.logInfo("setting last update id", id)
              yield* Ref.update(lastUpdateIdRef, () => id + 1);
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

        const handlerEffect = (
          messageHandler: MessageHandler
        ) =>
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

                    const handlerResult =
                      messageHandler({
                        message: messageUpdate.update,
                        currentChatId: messageUpdate.chatId,
                        service
                      });

                    if (handlerResult instanceof Promise) {
                      return Effect.tryPromise(() => handlerResult); // just wait for promise resolving
                    }

                    if (Effect.isEffect(handlerResult)) {
                      return handlerResult as Effect.Effect<unknown, unknown, never>;  // just wait for effect resolving
                    }

                    return Effect.void; // discard handler result

                  })
                )
              )

            // run infinitely until first error in global scope
            return yield* pipe(
              handleBatchEffect,
              Effect.andThen(Effect.sleep("2 seconds")),
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
