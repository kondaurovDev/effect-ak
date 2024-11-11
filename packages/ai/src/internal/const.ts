export const aiModuleName = "effect-ak-ai"

export const chatCompletionProviders = ["openai", "anthropic"] as const;
export const availableVendors = [...chatCompletionProviders, "deepgram", "stabilityai"] as const;
