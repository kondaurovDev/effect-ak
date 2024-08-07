import { Schema as S } from "~effect-schema";
import * as Types from "./types"

// Database relations must be shared with your integration
const RelationColumn =
  S.Struct({
    type: S.Literal("relation"),
    relation: S.Struct({
      database_id: S.NonEmpty,
      synced_property_id: S.NonEmpty,
      synced_property_name: S.NonEmpty,
    }),
  });

// It isn't possible to update a status database property's name or options values via the API.
// contains values from a list of status options
const StatusColumn =
  S.Struct({
    type: S.Literal("status"),
    status: S.Struct({
      options: S.Array(
        S.Struct({
          color: Types.Colors,
          // An identifier for the option. It doesn't change if the name is changed
          id: S.NonEmpty,
          name: S.NonEmpty
        })
      ),
      // A group is a collection of options. The groups array is a sorted list of the available groups for the property
      groups: S.Array(S.Struct({
        id: S.NonEmpty,
        name: S.NonEmpty,
        color: Types.Colors,
        option_ids: S.Array(S.NonEmpty)
      }))
    }),
  });

export type DbColumn = S.Schema.Type<typeof DbColumn>
export const DbColumn =
  S.extend(
    S.Struct({
      id: S.NonEmpty,
      name: S.NonEmpty
    }),
    S.Union(
      Types.OneOf,
      StatusColumn,
      RelationColumn,
    )
  );
