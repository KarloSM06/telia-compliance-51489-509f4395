// OpenRouter pricing per 1M tokens (USD)
const MODEL_PRICES: Record<string, { input: number; output: number }> = {
  'anthropic/claude-sonnet-4.5': { input: 3.0, output: 15.0 },
  'anthropic/claude-sonnet-4': { input: 3.0, output: 15.0 },
  'openai/gpt-4.1': { input: 5.0, output: 15.0 },
  'openai/gpt-4.1-mini': { input: 0.15, output: 0.60 },
  'deepseek/deepseek-r1-0528-qwen3-8b': { input: 0.14, output: 0.28 },
  // Add fallback for unknown models
  'default': { input: 0.5, output: 1.5 }
};

/**
 * Calculate AI cost from token usage when cost_usd is not available
 * @param log AI usage log with model and token counts
 * @returns Cost in USD
 */
export function calculateAICost(log: {
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
}): number {
  const prices = MODEL_PRICES[log.model] || MODEL_PRICES['default'];
  
  if (!prices) {
    console.warn(`Missing price for model: ${log.model}, using default pricing`);
  }
  
  const inputCost = (log.prompt_tokens / 1_000_000) * prices.input;
  const outputCost = (log.completion_tokens / 1_000_000) * prices.output;
  
  return inputCost + outputCost; // Returns USD
}
