import * as dotenv from 'dotenv'
import OpenAI from 'openai'

// Load environment variables
dotenv.config()

// Initialize OpenAI client for Node.js environment
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Unified model call wrapper for Node.js environment
export async function callModel(
  prompt: string,
  model: string = "gpt-4o-mini",
  maxTokens: number = 512,
  temperature: number = 0.7
): Promise<string> {
  try {
    const response = await client.chat.completions.create({
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
  return !!process.env.OPENAI_API_KEY
}

// Get current API key status for debugging
export function getApiKeyStatus(): string {
  return process.env.OPENAI_API_KEY ? 'Set' : 'Not set'
}
