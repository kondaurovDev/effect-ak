import {Effect, pipe} from "effect";
import { Schema } from "@effect/schema";
import { parseJson, toJsonString } from "@efkit/shared";

import * as T from "./types";
import {Service} from "./service";
import { tryAwsServiceMethod } from "../error";

export const getParameter = (
  paramName: T.ParameterName
) =>
  Effect.Do.pipe(
    Effect.bind("ssmSDK", () => Service),
    Effect.bind("parameter", (({ ssmSDK }) => 
      tryAwsServiceMethod(
        `getting parameter ${paramName}`, 
        () =>
          ssmSDK.getParameter({
            Name: paramName,
            WithDecryption: true
          })
      )
    )),
    Effect.andThen(({ parameter }) =>
      Effect.fromNullable(parameter.Parameter)
    )
  )

export const getParameterValue = (
  paramName: T.ParameterName
) =>
  pipe(
    getParameter(paramName),
    Effect.andThen(_ =>
      Effect.fromNullable(_.Value)
    ),
    Effect.tap(raw =>
      Effect.logDebug("param value", raw)
    )
  );

export const getJsonParamValue = (
  paramName: T.ParameterName
) =>
  pipe(
    getParameterValue(paramName),
    Effect.andThen(value => parseJson(value)),
    Effect.andThen(
      Schema.validate(
        Schema.Record({ key: Schema.String, value: Schema.Unknown })
      )
    )
  )

export const putParameter = (
  paramName: T.ParameterName,
  paramValue: T.ParameterValue
) =>
  Effect.Do.pipe(
    Effect.bind("ssmSDK", () => Service),
    Effect.bind("put", ({ ssmSDK }) =>
      tryAwsServiceMethod(
        `put parameter ${paramName}`, 
        () =>
          ssmSDK.putParameter({
            Name: paramName,
            Value: paramValue,
            Type: "String",
            Overwrite: true
          })
      )
    )
  )

export const putJsonParameter = (
  paramName: T.ParameterName,
  value: unknown
) =>
  pipe(
    toJsonString(value),
    Effect.andThen(param => 
      putParameter(paramName, T.ParameterValue(param))
    )
  );
