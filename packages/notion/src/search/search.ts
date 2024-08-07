import { Effect, pipe } from "~effect";
import { S } from "~effect-schema";

import * as Domain from "../_domain"
import * as Brand from "../brand.types"
import { RestClient, RestClientLive } from "../client"
import { HttpClient } from "~effect-platform";

// https://developers.notion.com/reference/post-search

const Response = S.Struct({
  object: S.Literal("list"),
  results: S.Array(Domain.PageSchema)
})

export const search = (
  _: [ Brand.SearchQuery, Brand.SearchFilter ]
) => pipe(
  RestClient,
  Effect.andThen(client => 
    client(
      HttpClient.request.post(
        Brand.ApiEndpointPath("search"), {
          body: HttpClient.body.unsafeJson({
            query: _[0],
            filter: {
              value: _[1],
              property: "object"
            }
          })
        }
      ))
  ),
  Effect.andThen(response => S.validate(Response)(response)),
  Effect.andThen(response => response.results),
  Effect.provide(RestClientLive)
);
