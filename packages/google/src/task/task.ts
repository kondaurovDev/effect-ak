import { Schema as S } from "@effect/schema";
import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { GoogleApiRestClient } from "../client.js";

const prefix = "/tasks/v1/lists";

const description = "daily task to be done and not to be forgotten";

export const TaskSchema =
  S.Struct({
    id: S.optional(S.String),
    title: S.String,
    due: S.String.annotations({
      description: "Due date of the task (as a RFC 3339 timestamp)"
    }),
    notes: S.String.annotations({
      description: "short description of task"
    })
  }).annotations({
    title: "GoogleTask",
    description
  });

export const CreateTaskSchema =
  pipe(
    TaskSchema,
    S.pick("due", "title", "notes")
  ).annotations({
    title: "CreateGoogleTask",
    description
  })

// https://developers.google.com/tasks/reference/rest/v1/tasks/list
export const getTasks = (
  taskListId: string
) =>
  pipe(
    GoogleApiRestClient,
    Effect.andThen((client) =>
      client.execute(
        "tasks",
        HttpClientRequest.get(`${prefix}/${taskListId}/tasks`)
      )
    ),
    Effect.andThen(
      S.validate(S.Struct({ items: S.Array(TaskSchema) }))
    ),
    Effect.andThen(_ => _.items)
  )

export const createTask = (
  taskListId: string,
  task: typeof CreateTaskSchema.Type
) =>
  pipe(
    Effect.all({
      client: GoogleApiRestClient,
      body: HttpBody.json(task)
    }),
    Effect.andThen(({ client, body }) =>
      client.execute(
        "tasks",
        HttpClientRequest.post(`${prefix}/${taskListId}/tasks`, { body })
      )
    )
  )
