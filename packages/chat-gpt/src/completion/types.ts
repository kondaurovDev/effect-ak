import { Brand } from "effect"

export type UserName = 
  string & Brand.Brand<"UserName">;
export const UserName = Brand.nominal<UserName>();