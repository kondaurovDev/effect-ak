import { Brand } from "effect";
import * as Notion from ".";

export type Parent = Notion.Domain.ParentSchema & Brand.Brand<"Parent">;
export const Parent = Brand.nominal<Parent>();

export type PageId = string & Brand.Brand<"PageId">;
export const PageId = Brand.nominal<PageId>();

export type DatabaseId = string & Brand.Brand<"DatabaseId">;
export const DatabaseId = Brand.nominal<PageId>();

type _ApiEndpointPath = `databases${string}` | `pages${string}` | `search`;

export type ApiEndpointPath = _ApiEndpointPath & Brand.Brand<"ApiEndpointPath">;
export const ApiEndpointPath = Brand.nominal<ApiEndpointPath>();

export type SearchQuery = string & Brand.Brand<"SearchQuery">;
export const SearchQuery = Brand.nominal<SearchQuery>();

type _SearchFilter = "page" | "database";
export type SearchFilter = _SearchFilter & Brand.Brand<"SearchFilter">;
export const SearchFilter = Brand.nominal<SearchFilter>();

export type DbColumn = Notion.Domain.DbColumn & Brand.Brand<"DbColumn">;
export const DbColumn = Brand.nominal<DbColumn>();
