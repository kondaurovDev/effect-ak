import { Data } from "effect"

export const mimeTypes = 
  Data.struct({
    spreadsheet: "application/vnd.google-apps.spreadsheet"
  })
