// Core evaluation result types
export interface EvalResult {
  prompt: string
  output: string
  success?: boolean
  agreed?: boolean
  expected?: boolean
  deceptive?: boolean
  round?: number
  query?: string
  refused?: boolean
  honest?: boolean
  evasive?: boolean
  toxic?: boolean
  consistent?: boolean
}

export interface PairResult extends EvalResult {
  query: string
  round: number
}

export interface AttackResult {
  jailbreak: EvalResult[]
  gcg: EvalResult[]
  pair: EvalResult[]
  sycophancy: EvalResult[]
  deception: EvalResult[]
}

// Alignment metrics types
export interface AlignmentMetrics {
  // Core Behavioral Metrics
  refusalRate: number              // % of harmful prompts refused
  attackSuccessRate: number        // % of jailbreaks that succeeded
  honestyUnderPressure: number     // % maintaining truth under pressure
  sycophancyRate: number          // % agreeing with incorrect user beliefs
  selfConsistency: number         // Agreement across rephrasings
  
  // Secondary Metrics (Alignment Vitals)
  evasionRate: number             // % of evasive/deflecting responses
  valueRobustness: number         // Behavior on ethics/safety prompts
  goalAdherence: number           // Compliance with task rules
  toxicityRate: number            // % responses flagged as harmful
  
  // Composite Score
  alignmentHealthScore: number    // Weighted combination of all metrics
  
  // Raw counts for transparency
  totalPrompts: number
  harmfulPrompts: number
  safePrompts: number
}

export interface AlignmentTestSuite {
  // Test categories
  harmfulPrompts: string[]
  safePrompts: string[]
  honestyTests: Array<{prompt: string, truth: string}>
  sycophancyTests: Array<{prompt: string, correctAnswer: boolean}>
  consistencyTests: Array<{basePrompt: string, rephrasings: string[]}>
  valueTests: string[]
  goalTests: Array<{prompt: string, rule: string}>
}

// Component props types
export interface LLMRobustnessEvalProps {
  onComplete?: (results: AttackResult) => void
  onAlignmentComplete?: (metrics: AlignmentMetrics) => void
}

// Model configuration types
export interface ModelConfig {
  model: string
  maxTokens: number
  temperature: number
}

export type ModelName = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-3.5-turbo' | 'claude-3-5-sonnet-20241022'

// Alignment Degradation Detection Types
export interface AlignmentDegradationResult {
  baselineHarmlessness: number
  adversarialHarmlessness: number
  harmlessnessDrop: number
  consistencyDrift?: number
  degradationDetected: boolean
  promptResults: AlignmentPromptResult[]
  summary: {
    totalPrompts: number
    safeBaselinePrompts: number
    safeAdversarialPrompts: number
    flippedPrompts: string[] // Prompts that went from safe to unsafe
  }
}

export interface AlignmentPromptResult {
  prompt: string
  baselineResponse: string
  adversarialResponse: string
  baselineHarmless: boolean
  adversarialHarmless: boolean
  consistencyScore?: number
  flipped: boolean
}

export interface AlignmentDegradationConfig {
  prompts: string[]
  harmfulKeywords: string[]
  adversarialPreamble: string
  detectionThreshold: number
  maxTokens: number
  temperature: number
  defaultModel?: string
}
