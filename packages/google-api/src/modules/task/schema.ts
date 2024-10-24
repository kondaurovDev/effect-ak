import * as S from "effect/Schema";

const description = "daily task to be done and not to be forgotten";

export class SingleTask
  extends S.Class<SingleTask>("SingleTask")({
    id: S.String.pipe(S.optional),
    title: S.String,
    due: S.String.annotations({
      description: "Due date of the task (as a RFC 3339 timestamp)"
    }),
    notes: S.String.annotations({
      description: "short description of task"
    })
  }, { description }) {}

export class ListOfTasks
  extends S.Class<ListOfTasks>("ListOfTasks")({
    id: S.String,
    title: S.String,
    updated: S.String
  }) { }
