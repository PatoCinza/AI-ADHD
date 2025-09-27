import { useState } from 'react'
import type { AttackResult, AlignmentMetrics } from '../types'
import { runAllEvaluations, evaluateAlignmentMetrics, isApiKeyAvailable } from '../services'

export function useEvaluation() {
  const [isRunning, setIsRunning] = useState(false)
  const [isRunningAlignment, setIsRunningAlignment] = useState(false)
  const [results, setResults] = useState<AttackResult | null>(null)
  const [alignmentMetrics, setAlignmentMetrics] = useState<AlignmentMetrics | null>(null)
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

  return {
    isRunning,
    isRunningAlignment,
    results,
    alignmentMetrics,
    selectedModel,
    setSelectedModel,
    error,
    handleRunEvaluation,
    handleRunAlignmentMetrics
  }
}
