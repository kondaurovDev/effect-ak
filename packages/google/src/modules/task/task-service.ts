import { Effect, pipe } from "effect"
import { HttpBody, HttpClientRequest } from "@effect/platform"
import { Schema as S } from "@effect/schema";

import { BaseEndpoint } from "../../api/index.js"
import { SingleTask } from "./schema.js";
import { tasksListUrlPrefix } from "./const.js";

export type GetTasksCommand = {
  taskListId: number
}

export type CreateTaskCommand = {
  taskListId: number
  task: SingleTask
}

export class TaskService
  extends Effect.Service<TaskService>()("TaskService", {
    effect:
      Effect.gen(function* () {
        const baseEndpoint = yield* BaseEndpoint;

        const getTasks = (
          command: GetTasksCommand
        ) => 
          pipe(
            baseEndpoint.execute(
              "tasks",
              HttpClientRequest.get(`/tasks/v1/users/@me/${command.taskListId}/tasks`)
            ),
            Effect.andThen(
              S.validate(S.Struct({ items: S.Array(SingleTask) }))
            ),
            Effect.andThen(_ => _.items)
          )

        const createTask = (
          command: CreateTaskCommand
        ) =>
          pipe(
            HttpBody.json(command.task),
            Effect.andThen(body =>
              baseEndpoint.execute(
                "tasks",
                HttpClientRequest.post(
                  `${tasksListUrlPrefix}/${command.taskListId}/tasks`, {
                    body
                  }
                )
              )
            )
          );

        return {
          getTasks, createTask
        } as const;
      }),

      dependencies: [
        BaseEndpoint.Default
      ]
  }) {}