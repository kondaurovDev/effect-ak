import {Brand} from "effect";

export type ParameterName = string & Brand.Brand<"ParameterName">;
export const ParameterName = Brand.nominal<ParameterName>();

export type ParameterValue = string & Brand.Brand<"ParameterValue">;
export const ParameterValue = Brand.nominal<ParameterValue>();

export type UnknownParameter = unknown & Brand.Brand<"UnknownParameter">;
export const UnknownParameter = Brand.nominal<UnknownParameter>();