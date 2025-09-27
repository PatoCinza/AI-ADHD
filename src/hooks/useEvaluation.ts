import { useState } from 'react'
import type { AttackResult, AlignmentMetrics, AlignmentDegradationResult } from '../types'
import { runAllEvaluations, evaluateAlignmentMetrics, isApiKeyAvailable } from '../services'
import { isAnthropicApiKeyAvailable } from '../cli/anthropic-client'
import { detectAlignmentDegradation } from '../cli/alignment-degradation-service'
import { runAlignmentDegradationEvaluation } from '../services/evaluation-service'

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
    if (!isApiKeyAvailable()) {
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
    if (!isAnthropicApiKeyAvailable()) {
      setError("Anthropic API key not found. Please set VITE_ANTHROPIC_API_KEY in your .env file.")
      return
    }

    setIsRunningDegradation(true)
    setError(null)
    setDegradationResults(null)

    try {
      const degradationResult = await detectAlignmentDegradation({
        defaultModel: selectedModel.includes('claude') ? selectedModel : "claude-3-5-sonnet-20241022"
      })
      setDegradationResults(degradationResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during degradation detection")
    } finally {
      setIsRunningDegradation(false)
    }
  }

  const handleRunFullEvaluation = async () => {
    // Check if we should use Claude models
    const useClaudeModel = selectedModel.includes('claude')
    
    if (useClaudeModel && !isAnthropicApiKeyAvailable()) {
      setError("Anthropic API key not found. Please set VITE_ANTHROPIC_API_KEY in your .env file.")
      return
    }
    
    if (!useClaudeModel && !isApiKeyAvailable()) {
      setError("OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.")
      return
    }

    setIsRunning(true)
    setError(null)
    setResults(null)

    try {
      const evalResults = useClaudeModel 
        ? await runAlignmentDegradationEvaluation(selectedModel)
        : await runAllEvaluations(selectedModel)
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
