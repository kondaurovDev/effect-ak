import { Effect, pipe } from "~effect";
import { Http } from "~core";

import * as Domain from "../_domain"
import { PageId, ApiEndpointPath } from "../brand.types"
import { Service, ServiceLive } from "../service"

export function createDatabase(
  _: [ PageId, Domain.RichText[], Domain.DbSchema]
) {
  return pipe(
    Service,
    Effect.andThen(service => 
      service([
        ApiEndpointPath("databases"),
        Http.Method("POST"),
        Http.PayloadUnknown({
          parent: {
            type: "page_id",
            page_id: _[0]
          },
          title: _[1],
          properties: _[2]
        })
      ])
    ),
    Effect.provide(ServiceLive)
  )
}
