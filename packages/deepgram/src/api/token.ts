import { Brand, Context, Redacted } from "effect";

export type DeepgramToken = Brand.Branded<Redacted.Redacted<string>, "DeepgramToken">;
export const DeepgramToken = Brand.nominal<DeepgramToken>();

export class DeepgramTokenProvider extends
  Context.Tag("DeepgramTokenProvider")<DeepgramTokenProvider, DeepgramToken>() {};
