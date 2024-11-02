import { Effect, pipe, Ref, Schema as S } from "effect";

import { TgBotHttpClient } from "../api/http-client.js";

import { OriginUpdateEvent, MessageUpdate, MessageUpdateEvent, TgChatService, ChatId } from "../module/chat/index.js";
import { TgFileService } from "../module/file/service.js";
import { TgBotSettingsService } from "../module/settings/service.js";

export type MessageHandler =
  (_: {
    message: MessageUpdate,
    currentChatId: ChatId,
    chat: TgChatService,
    file: TgFileService,
    settings: TgBotSettingsService
  }) => unknown

export class PollingService
  extends Effect.Service<PollingService>()("PollingService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* TgBotHttpClient;

        const modules = {
          chat: yield* TgChatService,
          file: yield* TgFileService,
          settings: yield* TgBotSettingsService
        }

        const lastUpdateIdRef =
          yield* Ref.make<number | undefined>(undefined);

        const getLastUpdatesEffect =
          Effect.gen(function* () {

            const lastUpdateId = yield* Ref.get(lastUpdateIdRef);

            yield* Effect.logInfo("Getting updates", lastUpdateId);

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

            const id = updates.at(-1)?.update_id;
            if (id) {
              console.log("setting update id", id);
              yield* Ref.update(lastUpdateIdRef, () => id + 1);
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
                        ...modules
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

            // run infinitely in global scope
            return yield* pipe(
              handleBatchEffect,
              Effect.forever,
              Effect.forkDaemon
            );

          });

        return {
          handlerEffect
        } as const

      }),

    dependencies: [
      TgBotHttpClient.Default,
      TgChatService.Default,
      TgBotSettingsService.Default,
      TgFileService.Default
    ]
  }) { }
