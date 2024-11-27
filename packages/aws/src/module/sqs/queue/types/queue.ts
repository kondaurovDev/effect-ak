import * as S from "effect/Schema";
import * as Data from "effect/Data";

import * as Attribute from "./attributes.js";
import { CommonQueueAttributes } from "./attributes.js";
import { SqsMethodInput } from "../../client.js";

export class AllQueueAttributes 
  extends Data.Class<Exclude<SqsMethodInput<"setQueueAttributes">["Attributes"], undefined>> {}

export class FifoQueue
  extends CommonQueueAttributes.extend<FifoQueue>("FifoQueue")({
    queueType: S.Literal("fifo"),
    throughputLimit: Attribute.FifoThoughputLimit.pipe(S.optional),
    deduplication: Attribute.DeduplicationScope.pipe(S.optional)
  }) { }

export class StandardQueue
  extends CommonQueueAttributes.extend<StandardQueue>("StandardQueue")({
    queueType: S.Literal("standard")
  }) { }

export class OneOfQueue
  extends S.Class<OneOfQueue>("OneOfQueue")({
    queue:
      S.Union(FifoQueue, StandardQueue).annotations({
        identifier: "SQS/Queue"
      })
  }) {}
