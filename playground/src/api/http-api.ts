import { HttpApi } from "@effect/platform";

import { ApiEndpoints, PageEndpoints, StaticFilesEndpoints } from "./definition.js";

export class BackendApi
  extends HttpApi.empty
    .add(ApiEndpoints)
    .add(PageEndpoints)
    .add(StaticFilesEndpoints) {}
