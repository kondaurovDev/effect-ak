import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { ResourceGroupsTaggingApiClientService } from "../client.js";
import { ServiceError } from "../../../internal/error.js";

type TagIdWithValue = `${string}:${string}`

export class ResourceGroupsTagSearchService
  extends Effect.Service<ResourceGroupsTagSearchService>()("ResourceGroupsTagSearchService", {
    effect:
      Effect.gen(function* () {

        const client = yield* ResourceGroupsTaggingApiClientService;

        const getOneResourceArnByTags =
          (input: { 
            resourceType: string, 
            tags: readonly TagIdWithValue[] 
          }) =>
            pipe(
              getResourcesByTags({ resourceTypes: [ input.resourceType ], tags: input.tags }),
              Effect.filterOrFail(
                list => list.length === 0 || list.length === 1,
                () => new ServiceError({ description: "More than one resource has been found" })
              ),
              Effect.andThen(list =>
                pipe(
                  Effect.succeed(list.at(0)),
                  Effect.andThen(resource =>
                    resource != null ?
                      Effect.succeed(resource.ResourceARN) :
                      Effect.succeed(undefined)
                  )
                )
              )
            );

        const getResourcesByTags =
          (input: {
            resourceTypes: string[],
            tags: readonly TagIdWithValue[]
          }) =>
            Effect.gen(function* () {

              const tags =
                input.tags.map(tag => {
                  const colon = tag.indexOf(":")
                  return {
                    Key: tag.substring(0, colon).trim(),
                    Values: [tag.substring(colon + 1).trim()]
                  }
                });

              const result =
                yield* client.execute(
                  "get tagged resources", _ =>
                  _.getResources({
                    ResourceTypeFilters: input.resourceTypes,
                    TagFilters: tags
                  })
                ).pipe(
                  Effect.andThen(_ =>
                    _.ResourceTagMappingList ?? []
                  )
                );

              yield* Effect.logDebug("tags response", { input, result });

              return result;

            })

        return {
          getOneResourceArnByTags, getResourcesByTags
        } as const;

      }),

    dependencies: [
      ResourceGroupsTaggingApiClientService.Default
    ]
  }) { }