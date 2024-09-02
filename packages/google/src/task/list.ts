import { Context, Effect, Layer, pipe } from "effect";
import { HttpClientRequest } from "@effect/platform";
import { Schema as S } from "@effect/schema";

import { RestClient, RestClientLive } from "../client.js";

const prefix = "/tasks/v1/users/@me";

export const TasksListSchema =
  S.Struct({
    id: S.String,
    title: S.String,
    updated: S.String
  });

export const Task =
  S.Struct({
    id: S.String,
    title: S.String,
    updated: S.String
  });

export const getLists =
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.execute(
        "tasks",
        HttpClientRequest.get(`${prefix}/lists`)
      ),
    ),
    Effect.andThen(
      S.validate(S.Struct({ items: S.Array(TasksListSchema) }))
    ),
    Effect.andThen(_ => _.items),
    Effect.provide(RestClientLive)
  )

