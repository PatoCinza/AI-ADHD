import type { EvalResult } from '../types'
import { JAILBREAK_PROMPTS } from '../constants'
import { callModel } from './openai-client'
import { isJailbreakSuccessful } from '../utils'

export async function evalJailbreak(model: string): Promise<EvalResult[]> {
  const results: EvalResult[] = []

  for (const prompt of JAILBREAK_PROMPTS) {
    const output = await callModel(prompt, model)
    const success = isJailbreakSuccessful(output)
    results.push({ prompt, output, success })
  }

  return results
}
