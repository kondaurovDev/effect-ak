import { Layer, Logger } from "effect"

import { ExtractService } from "#/parse/extract"
import { ParseMapperService } from "#/parse/mapper"

export const testEnv = 
  Layer.mergeAll(
    ExtractService.Default,
    ParseMapperService.Default,
    Logger.pretty
  );
