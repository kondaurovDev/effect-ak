import { Context, Effect } from "effect"
import { Schema as S } from "@effect/schema"

import { TgBotApiClientError, TgBotApiServerError } from "./error.js"
import { TgBotToken } from "../domain/token.js"

export type MethodResult<A> =
  Effect.Effect<A, TgBotApiClientError | TgBotApiServerError, TgBotToken>

export type TgRestClientService = {
  execute: <O, O2>(
    methodName: `/${string}`,
    body: Record<string, unknown>,
    resultSchema: S.Schema<O, O2>
  ) => MethodResult<O>
}

export class TgRestClient
  extends Context.Tag("TgBot.RestClient")<TgRestClient, TgRestClientService>() { };