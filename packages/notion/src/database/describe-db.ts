// https://developers.notion.com/reference/retrieve-a-database

import { Effect, S, pipe } from "~effect";
import { Misc, Http } from "~core";

import * as Notion from "..";

export const describeDatabase = (
  dbId: string
) => pipe(
  Notion.Service,
  Effect.andThen(service => 
    service([
      Notion.ApiEndpointPath(`databases/${dbId}`),
      Http.Method("get"),
      Http.PayloadUnknown(undefined)
    ])
  ),
  Effect.andThen(response => 
    S.validate(Notion.Domain.PageSchema)(response)
  )
)
