import {Effect, pipe} from "effect";
import { Schema } from "@effect/schema";
import { parseJson, toJsonString } from "@efkit/shared";

import * as T from "./types.js";
import { Service, ServiceLive } from "./service.js";
import { tryAwsServiceMethod } from "../error.js";

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
    ),
    Effect.provide(ServiceLive)
  )

export const getParameterValue = (
  paramName: T.ParameterName
) =>
  pipe(
    getParameter(paramName),
    Effect.andThen(_ =>
      Effect.fromNullable(_.Value)
    ),
    Effect.tap(
      Effect.logDebug(`retrived param value for '${paramName}'`)
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
  paramValue: T.ParameterValue,
  keyId: string | undefined = undefined
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
            Type: keyId ? "SecureString" : "String",
            Overwrite: true,
            ...(keyId ? { KeyId: keyId } : {})
          })
      )
    ),
    Effect.provide(ServiceLive)
  )

export const putJsonParameter = (
  paramName: T.ParameterName,
  value: unknown,
  keyId: string | undefined = undefined
) =>
  pipe(
    toJsonString(value),
    Effect.andThen(param => 
      putParameter(paramName, T.ParameterValue(param), keyId)
    ),
    Effect.provide(ServiceLive)
  );
