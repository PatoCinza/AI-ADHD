import type { 
  AlignmentDegradationResult, 
  AlignmentPromptResult, 
  AlignmentDegradationConfig 
} from '../types'
import { ALIGNMENT_DEGRADATION_CONFIG } from '../constants'
import { callClaude } from './anthropic-client'

/**
 * CLI version of alignment degradation detection service
 * This matches the Python script functionality exactly
 */

function checkHarmlessness(text: string, harmfulKeywords: string[]): boolean {
  const lowerText = text.toLowerCase()
  return !harmfulKeywords.some(keyword => lowerText.includes(keyword))
}

function calculateJaccardSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(word => word.length > 2))
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(word => word.length > 2))
  
  const intersection = new Set([...words1].filter(word => words2.has(word)))
  const union = new Set([...words1, ...words2])
  
  return union.size === 0 ? 0 : intersection.size / union.size
}

async function generateResponse(
  prompt: string, 
  isAdversarial: boolean = false, 
  config: AlignmentDegradationConfig
): Promise<string> {
  const prefix = isAdversarial ? config.adversarialPreamble : ""
  const fullPrompt = prefix + prompt
  
  try {
    return await callClaude(
      fullPrompt, 
      config.defaultModel || "claude-3-5-sonnet-20241022",
      config.maxTokens,
      config.temperature
    )
  } catch (error) {
    console.error(`Error generating response for prompt: ${prompt}`, error)
    return ""
  }
}

export async function detectAlignmentDegradation(
  customConfig?: Partial<AlignmentDegradationConfig>
): Promise<AlignmentDegradationResult> {
  const config: AlignmentDegradationConfig = {
    ...ALIGNMENT_DEGRADATION_CONFIG,
    adversarialPreamble: ALIGNMENT_DEGRADATION_CONFIG.adversarialPreambles[0],
    ...customConfig
  }

  console.log("=== ALIGNMENT DEGRADATION DETECTION EXPERIMENT ===")
  console.log(`Testing Claude Sonnet 4 for simulated alignment degradation`)
  console.log(`Using ${config.prompts.length} prompts\n`)
  
  const promptResults: AlignmentPromptResult[] = []
  let baselineHarmlessCount = 0
  let adversarialHarmlessCount = 0
  const flippedPrompts: string[] = []

  console.log("=== COLLECTING RESPONSES ===")
  
  for (let i = 0; i < config.prompts.length; i++) {
    const prompt = config.prompts[i]
    console.log(`Testing prompt ${i + 1}/${config.prompts.length}: ${prompt.substring(0, 30)}...`)
    
    // Add delay between requests
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    try {
      // Generate responses sequentially to match Python script behavior
      const baselineResponse = await generateResponse(prompt, false, config)
      const adversarialResponse = await generateResponse(prompt, true, config)
      
      const baselineHarmless = checkHarmlessness(baselineResponse, config.harmfulKeywords)
      const adversarialHarmless = checkHarmlessness(adversarialResponse, config.harmfulKeywords)
      
      const consistencyScore = calculateJaccardSimilarity(baselineResponse, adversarialResponse)
      const flipped = baselineHarmless && !adversarialHarmless
      
      if (flipped) {
        flippedPrompts.push(prompt)
      }
      
      if (baselineHarmless) baselineHarmlessCount++
      if (adversarialHarmless) adversarialHarmlessCount++
      
      promptResults.push({
        prompt,
        baselineResponse,
        adversarialResponse,
        baselineHarmless,
        adversarialHarmless,
        consistencyScore,
        flipped
      })
      
      console.log(`  ${prompt.substring(0, 30)}... B:${baselineHarmless ? 1 : 0} D:${adversarialHarmless ? 1 : 0}`)
      
    } catch (error) {
      console.error(`Error processing prompt: ${prompt}`, error)
      promptResults.push({
        prompt,
        baselineResponse: "",
        adversarialResponse: "",
        baselineHarmless: false,
        adversarialHarmless: false,
        consistencyScore: 0,
        flipped: false
      })
    }
  }

  console.log("\n=== ANALYZING RESULTS ===")

  const totalPrompts = config.prompts.length
  const baselineHarmlessness = baselineHarmlessCount / totalPrompts
  const adversarialHarmlessness = adversarialHarmlessCount / totalPrompts
  const harmlessnessDrop = baselineHarmlessness - adversarialHarmlessness
  
  const consistencyScores = promptResults
    .map(r => r.consistencyScore || 0)
    .filter(score => score > 0)
  const averageConsistency = consistencyScores.length > 0 
    ? consistencyScores.reduce((a, b) => a + b, 0) / consistencyScores.length 
    : 0
  const consistencyDrift = 1 - averageConsistency

  const degradationDetected = harmlessnessDrop > config.detectionThreshold

  console.log(`Baseline Harmlessness: ${baselineHarmlessness.toFixed(2)}`)
  console.log(`Degraded Harmlessness: ${adversarialHarmlessness.toFixed(2)}`)
  console.log(`Drop: ${harmlessnessDrop.toFixed(2)}`)
  console.log(`\nDegradation Detected: ${degradationDetected ? 'YES' : 'NO'}`)

  return {
    baselineHarmlessness,
    adversarialHarmlessness,
    harmlessnessDrop,
    consistencyDrift,
    degradationDetected,
    promptResults,
    summary: {
      totalPrompts,
      safeBaselinePrompts: baselineHarmlessCount,
      safeAdversarialPrompts: adversarialHarmlessCount,
      flippedPrompts
    }
  }
}

// Export results in formats matching the Python script
export function exportResults(result: AlignmentDegradationResult) {
  // Create results object matching Python output
  const output = {
    baseline_harmlessness: result.baselineHarmlessness,
    degraded_harmlessness: result.adversarialHarmlessness,
    drop: result.harmlessnessDrop,
    consistency_drift: result.consistencyDrift,
    detection: result.degradationDetected,
    results: result.promptResults.map(r => ({
      prompt: r.prompt.substring(0, 30),
      baseline_harmless: r.baselineHarmless ? 1 : 0,
      degraded_harmless: r.adversarialHarmless ? 1 : 0
    }))
  }

  console.log("\n=== EXPERIMENT COMPLETED ===")
  console.log("📊 Results saved to results.json")
  
  return output
}
