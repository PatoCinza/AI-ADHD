import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config()

let anthropicClient: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error("Anthropic API key not found. Please set ANTHROPIC_API_KEY in your .env file.")
    }
    anthropicClient = new Anthropic({
      apiKey
    })
  }
  return anthropicClient
}

export function isAnthropicApiKeyAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY
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
