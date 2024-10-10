import { Brand, Context, Redacted } from "effect";

export type ClaudeToken = Brand.Branded<Redacted.Redacted<string>, "ClaudeToken">;
export const ClaudeToken = Brand.nominal<ClaudeToken>();

export class ClaudeTokenProvider extends
  Context.Tag("ClaudeTokenProvider")<ClaudeToken, ClaudeToken>() {};
