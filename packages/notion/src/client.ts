import { Layer, pipe, Config, Effect, Context } from "effect";
import { HttpClient } from "@effect/platform";

export type RestClient = (
  request: HttpClient.request.ClientRequest
) => Effect.Effect<unknown>
export const RestClient = Context.GenericTag<RestClient>("RestClient");

export const RestClientLayer =
  Layer.effect(
    RestClient,
    pipe(
      Effect.all({
        token: Config.string("NOTION_API_TOKEN"),
        client: HttpClient.client.Client
      }),
      Effect.andThen(({ client, token }) =>
        client.pipe(
          HttpClient.client.mapRequest(
            HttpClient.request.setHeaders({
              "Authorization": `Bearer ${token}`,
              "Notion-Version": "2022-06-28",
            })
          ),
          HttpClient.client.mapRequest(
            HttpClient.request.prependUrl(
              "https://api.notion.com/v1"
            )
          )
        )
      ),
      Effect.andThen(client =>
        RestClient.of(
          (request) => pipe(
            client(request),
            Effect.andThen(_ => _.json),
            Effect.scoped,
            Effect.orDie
          )
        )
      ),
    )
  )

export const RestClientLive = RestClientLayer.pipe(
  Layer.provide(HttpClient.client.layer)
);
