import { useState } from 'react'
import type { AttackResult, AlignmentMetrics, AlignmentDegradationResult } from '../types'
import { 
  runAllEvaluations, 
  runUniversalEvaluation,
  evaluateAlignmentMetrics, 
  isApiKeyAvailable
} from '../services'
import { isAnthropicApiKeyAvailable } from '../services/anthropic-client'
import { detectAlignmentDegradation } from '../services/alignment-degradation-service'

export function useEvaluation() {
  const [isRunning, setIsRunning] = useState(false)
  const [isRunningAlignment, setIsRunningAlignment] = useState(false)
  const [isRunningDegradation, setIsRunningDegradation] = useState(false)
  const [results, setResults] = useState<AttackResult | null>(null)
  const [alignmentMetrics, setAlignmentMetrics] = useState<AlignmentMetrics | null>(null)
  const [degradationResults, setDegradationResults] = useState<AlignmentDegradationResult | null>(null)
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini")
  const [error, setError] = useState<string | null>(null)

  const handleRunEvaluation = async () => {
    const isClaudeModel = selectedModel.includes('claude')
    
    if (isClaudeModel && !isAnthropicApiKeyAvailable()) {
      setError("Anthropic API key not found. Please set VITE_ANTHROPIC_API_KEY in your .env file.")
      return
    }
    
    if (!isClaudeModel && !isApiKeyAvailable()) {
      setError("OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.")
      return
    }

    setIsRunning(true)
    setError(null)
    setResults(null)

    try {
      const evalResults = await runAllEvaluations(selectedModel)
      setResults(evalResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during evaluation")
    } finally {
      setIsRunning(false)
    }
  }

  const handleRunAlignmentMetrics = async () => {
    if (!isApiKeyAvailable()) {
      setError("OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.")
      return
    }

    setIsRunningAlignment(true)
    setError(null)
    setAlignmentMetrics(null)

    try {
      const metrics = await evaluateAlignmentMetrics(selectedModel)
      setAlignmentMetrics(metrics)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during alignment evaluation")
    } finally {
      setIsRunningAlignment(false)
    }
  }

  const handleRunDegradationDetection = async () => {
    const isClaudeModel = selectedModel.includes('claude')
    
    if (isClaudeModel && !isAnthropicApiKeyAvailable()) {
      setError("Anthropic API key not found. Please set VITE_ANTHROPIC_API_KEY in your .env file.")
      return
    }
    
    if (!isClaudeModel && !isApiKeyAvailable()) {
      setError("OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.")
      return
    }

    setIsRunningDegradation(true)
    setError(null)
    setDegradationResults(null)

    try {
      const degradationResult = await detectAlignmentDegradation({
        defaultModel: selectedModel
      })
      setDegradationResults(degradationResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during degradation detection")
    } finally {
      setIsRunningDegradation(false)
    }
  }

  const handleRunFullEvaluation = async () => {
    const isClaudeModel = selectedModel.includes('claude')
    
    if (isClaudeModel && !isAnthropicApiKeyAvailable()) {
      setError("Anthropic API key not found. Please set VITE_ANTHROPIC_API_KEY in your .env file.")
      return
    }
    
    if (!isClaudeModel && !isApiKeyAvailable()) {
      setError("OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.")
      return
    }

    setIsRunning(true)
    setError(null)
    setResults(null)

    try {
      const evalResults = await runUniversalEvaluation(selectedModel)
      setResults(evalResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during evaluation")
    } finally {
      setIsRunning(false)
    }
  }

  return {
    isRunning,
    isRunningAlignment,
    isRunningDegradation,
    results,
    alignmentMetrics,
    degradationResults,
    selectedModel,
    setSelectedModel,
    error,
    handleRunEvaluation,
    handleRunAlignmentMetrics,
    handleRunDegradationDetection,
    handleRunFullEvaluation
  }
}
