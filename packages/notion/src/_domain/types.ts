import { Schema as S } from "~effect-schema";

export const Colors =
  S.Literal(
    "blue", "brown", "default", "gray", "green",
    "orange", "pink", "purple", "red", "yellow"
  );

export const Number =
  S.Struct({
    format: S.Literal(
      "argentine_peso", "baht", "australian_dollar", "canadian_dollar",
      "chilean_peso", "colombian_peso", "danish_krone", "dirham", "dollar",
      "euro", "forint", "franc", "hong_kong_dollar", "koruna", "krona",
      "leu", "lira", "mexican_peso", "new_taiwan_dollar", "new_zealand_dollar",
      "norwegian_krone", "number", "number_with_commas", "percent",
      "philippine_peso", "pound", "peruvian_sol", "rand", "real", "ringgit",
      "riyal", "ruble", "rupee", "rupiah", "shekel", "singapore_dollar",
      "uruguayan_peso", "yen", "yuan", "won", "zloty"
    )
  });

export const MultiSelect =
  S.Struct({
    options: S.Array(
      S.Struct({
        id: S.NonEmpty,
        name: S.NonEmpty,
        color: Colors
      })
    )
  });

export const Select =
  S.Struct({
    options: S.Array(
      S.Struct({
        color: Colors,
        // An identifier for the option. It doesn't change if the name is changed
        id: S.NonEmpty,
        name: S.NonEmpty
      })
    )
  });

// values that are rollups, specific properties that are pulled from a related database.
export const Rollup =
  S.Struct({
    function: S.Literal(
      "average", "checked", "count_per_group", "count", "count_values",
      "date_range", "earliest_date", "empty", "latest_date", "max",
      "median", "min", "not_empty", "percent_checked", "percent_empty",
      "percent_not_empty", "percent_per_group", "percent_unchecked",
      "range", "unchecked", "unique", "show_original", "show_unique", "sum"
    ),
    relation_property_id: S.NonEmpty,
    relation_property_name: S.NonEmpty,
    rollup_property_id: S.NonEmpty,
    rollup_property_name: S.NonEmpty
  });

export const Formula =
  S.Struct({
    expression: S.NonEmpty
  });

export const CommonFields = <S extends string>(name: S) =>
  S.Struct({
    type: S.optional(S.Literal(name)),
  });

export type OneOf = S.Schema.Type<typeof OneOf>;
export const OneOf = S.Union(
  S.extend(
    CommonFields("number"),
    S.Struct({ number: Number })
  ),
  S.extend(
    CommonFields("select"),
    S.Struct({ select: Select })
  ),
  S.extend(
    CommonFields("multi_select"),
    S.Struct({ multi_select: MultiSelect })),
  S.extend(
    CommonFields("rollup"),
    S.Struct({ rollup: Rollup })),
  S.extend(
    CommonFields("formula"),
    S.Struct({ formula: Formula })),
  S.extend(
    CommonFields("checkbox"),
    S.Struct({ checkbox: S.object })),
  // contains people mentions of each row's author as values.
  S.extend(
    CommonFields("created_by"),
    S.Struct({ created_by: S.never })),
  S.extend(
    CommonFields("last_edited_time"),
    S.Struct({ last_edited_time: S.never })),
  S.extend(
    CommonFields("last_edited_by"),
    S.Struct({ last_edited_by: S.never })),
  // contains timestamps of when each row was created as values.
  S.extend(
    CommonFields("created_time"),
    S.Struct({ created_time: S.never })),
  S.extend(
    CommonFields("date"),
    S.Struct({ date: S.never })),
  // The Notion API does not yet support uploading files to Notion
  // files uploaded directly to Notion or external links to files
  S.extend(
    CommonFields("files"),
    S.Struct({ files: S.never })),
  S.extend(
    CommonFields("people"),
    S.Struct({ people: S.never })),
  S.extend(
    CommonFields("title"),
    S.Struct({ title: S.never })),
  // S.extend(
  //   CommonFields("url"),
  //   S.Struct({ url: S.object. })),
  S.extend(
    CommonFields("rich_text"),
    S.Struct({ rich_text: S.never })),
  S.extend(
    CommonFields("email"),
    S.Struct({ email: S.never })),
  S.extend(
    CommonFields("phone_number"),
    S.Struct({ phone_number: S.Record(S.never, S.never) })),
);
