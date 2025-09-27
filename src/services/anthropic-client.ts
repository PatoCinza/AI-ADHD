import Anthropic from '@anthropic-ai/sdk'

let anthropicClient: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error("Anthropic API key not found. Please set VITE_ANTHROPIC_API_KEY in your .env file.")
    }
    anthropicClient = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true
    })
  }
  return anthropicClient
}

export function isAnthropicApiKeyAvailable(): boolean {
  return !!import.meta.env.VITE_ANTHROPIC_API_KEY
}

export function getAnthropicApiKeyStatus(): string {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!key) return "Not found"
  if (key.length < 10) return "Invalid format"
  return `Found (${key.substring(0, 8)}...)`
}

export async function callClaude(
  prompt: string, 
  model: string = "claude-3-5-sonnet-20241022",
  maxTokens: number = 300,
  temperature: number = 0
): Promise<string> {
  const client = getAnthropicClient()
  
  try {
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: "user", content: prompt }]
    })
    
    return response.content[0].type === 'text' ? response.content[0].text : ''
  } catch (error) {
    console.error('Error calling Claude API:', error)
    throw error
  }
}
