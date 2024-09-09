import { Effect, pipe, Cause } from "effect";

import { getMe } from "./chat-methods.js";

export const getTgBotName =
  pipe(
    getMe(),
    Effect.filterOrFail(
      _ => _.is_bot == true,
      () => new Cause.NoSuchElementException
    ),
    Effect.andThen(_ =>
      Effect.fromNullable(_.username)
    )
  );
