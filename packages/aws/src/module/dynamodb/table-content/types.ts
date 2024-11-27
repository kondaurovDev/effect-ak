import * as Brand from "effect/Brand";
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

export type ItemOneAttribute = Sdk.AttributeValue & Brand.Brand<"ItemOneAttribute">;
export const ItemOneAttribute = Brand.nominal<ItemOneAttribute>();

export type ItemAttributes = Record<string, Sdk.AttributeValue> & Brand.Brand<"ItemAttributes">;
export const ItemAttributes = Brand.nominal<ItemAttributes>();

export type QueryItems = Brand.Branded<Sdk.QueryCommandInput, "QueryItems">;
export const QueryItems = Brand.nominal<QueryItems>();

export type UpdateExpressionWithAttrs = {
  expressionParts: string[]
  attributeNames: AttributeNames
  attributeValues: ItemAttributes
} & Brand.Brand<"UpdateExpressionWithAttrs">;
export const UpdateExpressionWithAttrs = Brand.nominal<UpdateExpressionWithAttrs>();

export type AttrsToGet = string[] & Brand.Brand<"AttrsToGet">;
export const AttrsToGet = Brand.nominal<AttrsToGet>();
