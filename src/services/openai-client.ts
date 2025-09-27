// OpenAI client service for browser environment

// We'll initialize OpenAI client only when needed to avoid import issues in browser
let client: any = null

const getClient = async () => {
  if (!client) {
    const OpenAI = (await import('openai')).default
    client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  }
  return client
}

// Unified model call wrapper for browser environment
export async function callModel(
  prompt: string,
  model: string = "gpt-4o-mini",
  maxTokens: number = 512,
  temperature: number = 0.7
): Promise<string> {
  try {
    const openaiClient = await getClient()
    const response = await openaiClient.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature,
    })
    return response.choices[0]?.message?.content?.trim() || ""
  } catch (error) {
    console.error(`Error calling model ${model}:`, error)
    return ""
  }
}

// Check if API key is available
export function isApiKeyAvailable(): boolean {
  return !!import.meta.env.VITE_OPENAI_API_KEY
}

// Get current API key status for debugging
export function getApiKeyStatus(): string {
  return import.meta.env.VITE_OPENAI_API_KEY ? 'Set' : 'Not set'
}
