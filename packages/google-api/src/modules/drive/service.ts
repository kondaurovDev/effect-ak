import { Effect } from "effect";
import { HttpClientRequest } from "@effect/platform";

import { BaseEndpoint } from "../../api/index.js";

export type FindFilesCommand = {
  mimeType: string
}

export class DriveService
  extends Effect.Service<DriveService>()(`DriveService`, {
    
    effect:
      Effect.gen(function* () {
        const baseEndpoint = yield* BaseEndpoint;
        
        const getFiles = (
          request: FindFilesCommand
        ) =>
          baseEndpoint.execute(
            "apis",
            HttpClientRequest.get("/drive/v3/files", {
              urlParams: {
                q: `mimeType = '${request.mimeType}'`
              }
            })
          )

        return {
          getFiles
        } as const;
      }),

      dependencies: [
        BaseEndpoint.Default
      ]
      
  }) {};


