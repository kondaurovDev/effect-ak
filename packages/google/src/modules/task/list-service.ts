import { Effect, pipe } from "effect"
import { HttpClientRequest } from "@effect/platform"
import { Schema as S } from "@effect/schema";

import { BaseEndpoint } from "../../api/index.js"
import { ListOfTasks } from "./schema.js";
import { myTaskListUrl } from "./const.js";

export class ListOfTaskService
  extends Effect.Service<ListOfTaskService>()("ListOfTaskService", {
    effect:
      Effect.gen(function* () {
        const baseEndpoint = yield* BaseEndpoint;

        const myTaskLists =
          pipe(
            baseEndpoint.execute(
              "tasks",
              HttpClientRequest.get(`${myTaskListUrl}/lists`)
            ),
            Effect.andThen(
              S.validate(S.Struct({ items: S.Array(ListOfTasks) }))
            ),
            Effect.andThen(_ => _.items)
          )

        return {
          myTaskLists
        } as const;

      }),

    dependencies: [
      BaseEndpoint.Default
    ]

  }) { }