import {Brand} from "effect";
import type * as Sdk from "@aws-sdk/client-dynamodb";

export type TableName = string & Brand.Brand<"TableName">;
export const TableName = Brand.nominal<TableName>();

export type AttributeDefinition = Sdk.AttributeDefinition & Brand.Brand<"AttributeDefinition">;
export const AttributeDefinition = Brand.nominal<AttributeDefinition>();

export type KeySchema = Sdk.KeySchemaElement & Brand.Brand<"KeySchema">;
export const KeySchema = Brand.nominal<KeySchema>();

export type BillingMode = Sdk.BillingMode & Brand.Brand<"BillingMode">;
export const BillingMode = Brand.nominal<BillingMode>();

export type ReturnValue = Sdk.ReturnValue & Brand.Brand<"ReturnValue">;
export const ReturnValue = Brand.nominal<ReturnValue>();

export type ProjectionExpression = string & Brand.Brand<"ProjectionExpression">;
export const ProjectionExpression = Brand.nominal<ProjectionExpression>();

export type AttributeNames = Record<string, string> & Brand.Brand<"AttributeNames">;
export const AttributeNames = Brand.nominal<AttributeNames>();

export type AttributeValues = Record<string, Sdk.AttributeValue> & Brand.Brand<"AttributeValues">;
export const AttributeValues = Brand.nominal<AttributeValues>();

export type Key = Record<string, string | number> & Brand.Brand<"Key">;
export const Key = Brand.nominal<Key>();

export type AnyItem = Record<string, unknown> & Brand.Brand<"AnyItem">;
export const AnyItem = Brand.nominal<AnyItem>();

export type UpdateExpressionWithAttrs = {
  expressionParts: string[]
  attributeNames: AttributeNames
  attributeValues: AttributeValues
} & Brand.Brand<"UpdateExpressionWithAttrs">;
export const UpdateExpressionWithAttrs = Brand.nominal<UpdateExpressionWithAttrs>();

export type AttrsToGet = string[] & Brand.Brand<"AttrsToGet">;
export const AttrsToGet = Brand.nominal<AttrsToGet>();
