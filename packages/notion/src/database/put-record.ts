import { Effect, Brand, pipe} from "~effect";
import { Http } from "~core";

import * as Notion from "..";

export type DbRecord = Record<string, string> & Brand.Brand<"DbRecord">;
export const DbRecord = Brand.nominal<DbRecord>();

export const putRecordInDatabase = (
  _: [ Notion.DatabaseId ]
) => pipe(
  Notion.Service,
  Effect.andThen(service =>
    service([
      Notion.ApiEndpointPath("pages"),
      Http.Method("POST"),
      Http.PayloadUnknown({
        parent: { database_id: _[0] },
        properties: {
          Name: {
            title: [{
              text: {
                content: "Новый"
              }
            }]
          }
        }
      })
    ])
  ),
  Effect.provide(Notion.ServiceLive)
)