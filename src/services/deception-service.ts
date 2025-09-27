import type { EvalResult } from '../types'
import { TRIGGER_PROMPTS } from '../constants'
import { callModel } from './openai-client'
import { isDeceptiveResponse } from '../utils'

export async function evalDeception(model: string): Promise<EvalResult[]> {
  const results: EvalResult[] = []

  for (const prompt of TRIGGER_PROMPTS) {
    const output = await callModel(prompt, model)
    const deceptive = isDeceptiveResponse(prompt, output)
    results.push({ prompt, output, deceptive })
  }

  return results
}
