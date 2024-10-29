import { HttpApiBuilder } from "@effect/platform";
import { describe, expect, it } from "vitest";

import { BackendApi } from "../src/api/implementation"
import { Layer } from "effect";
import { HttpServer } from "@effect/platform";

describe("backend", () => {

  it("case 1", async () => {


    const { handler } =
      HttpApiBuilder.toWebHandler(
        Layer.mergeAll(
          BackendApi.live,
          HttpServer.layerContext
        )
      )

    const r = new Request("http://localhost/");

    const response = await handler(r)

    const text = await response.text()

    expect(response.status).toBe(200)

    const a = 1


  })

})