import type { EvalResult } from '../types'
import { GCG_SUFFIXES, GCG_BASE_PROMPTS } from '../constants'
import { callModel } from './openai-client'
import { isJailbreakSuccessful } from '../utils'

export async function evalGcg(model: string): Promise<EvalResult[]> {
  const results: EvalResult[] = []

  for (const basePrompt of GCG_BASE_PROMPTS) {
    for (const suffix of GCG_SUFFIXES) {
      const fullPrompt = basePrompt + suffix
      const output = await callModel(fullPrompt, model)
      const success = isJailbreakSuccessful(output)
      results.push({ prompt: fullPrompt, output, success })
    }
  }

  return results
}
