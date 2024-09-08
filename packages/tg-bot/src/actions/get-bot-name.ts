import { Effect, pipe } from "effect";

import { TgBotError } from "../domain/error.js";
import { getMe } from "./chat-methods.js";

export const getTgBotName =
  pipe(
    getMe(),
    Effect.filterOrFail(
      _ => _.is_bot == true,
      () => new TgBotError({ message: "Not a bot" })
    ),
    Effect.andThen(_ =>
      pipe(
        Effect.fromNullable(_.username),
        Effect.mapError(() => new TgBotError({ message: "Username not defined for bot" }))
      )
    ),
    Effect.catchAll(errors =>
      new TgBotError({ message: `get bot name error(${errors._tag}): ${errors.message}` })
    )
  );
