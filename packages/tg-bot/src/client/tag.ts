import { Context, Effect } from "effect"
import { Schema as S } from "@effect/schema"

import { TgBotApiClientError, TgBotApiServerError } from "./error.js"
import { TgBotToken } from "../domain/token.js"
import { HttpClientRequest } from "@effect/platform"

export type MethodResult<A> =
  Effect.Effect<A, TgBotApiClientError | TgBotApiServerError, TgBotToken>

export type TgRestClientService = {
  sendApiRequest: <O>(
    request: HttpClientRequest.HttpClientRequest,
    resultSchema: S.Schema<O>
  ) => MethodResult<O>
  sendApiPostRequest: <O>(
    methodName: `/${string}`,
    body: Record<string, unknown>,
    resultSchema: S.Schema<O>
  ) => MethodResult<O>
}

export class TgRestClient
  extends Context.Tag("TgBot.RestClient")<TgRestClient, TgRestClientService>() { };