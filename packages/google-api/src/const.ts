export const authScopePrefix = "https://www.googleapis.com/auth";
export const moduleName = "effect-ak-google-api"; 
export const configPathConfigKey = "configFilePath";

export type BaseUrlDomain = keyof typeof baseUrlMap;

export const baseUrlMap = {
  apis: "www.googleapis.com",
  sheets: "sheets.googleapis.com",
  people: "people.googleapis.com",
  tasks: "tasks.googleapis.com"
} as const;