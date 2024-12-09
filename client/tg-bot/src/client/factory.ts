import type { Api } from "../specification/api";
import { makePayload, methodPath } from "./request";
import { isTgBotApiResponse, TgBotApiResponse } from "./response";

const defaultBaseUrl = "https://api.telegram.org";

export type TgBotClient = ReturnType<typeof makeTgBotClient>

export const makeTgBotClient =
  (options: {
    token: string,
    baseUrl?: string
  }) => {

    const baseUrl = options.baseUrl ?? defaultBaseUrl;

    const execute = async <M extends keyof Api>(
      method: M,
      input: Parameters<Api[M]>[0]
    ): Promise<TgBotApiResponse<ReturnType<Api[M]>>> => {

      const httpResponse =
        await fetch(
          `${baseUrl}/bot${options.token}/${methodPath(method)}`, {
          body: makePayload(input),
          method: "POST"
        }).then(_ => _.json());

      if (!isTgBotApiResponse<ReturnType<Api[M]>>(httpResponse)) 
        throw new Error("Not valid response", { 
          cause: httpResponse
        });

      return httpResponse;

    }

    return {
      execute
    } as const;

  }
