import { Context, Redacted } from "effect";

export class ClaudeToken extends
  Context.Tag("Claude.Token")<ClaudeToken, Redacted.Redacted<string>>() {};
