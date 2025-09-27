import { useState } from 'react'
import type { LLMRobustnessEvalProps, EvaluationStats } from './types'
import { isApiKeyAvailable, getApiKeyStatus } from './services'
import { isAnthropicApiKeyAvailable } from './services/anthropic-client'
import { useEvaluation } from './hooks'
import { EvaluationControls, AlignmentDashboard, AttackResults, AlignmentDegradationResults } from './components'
import PresentationMode from './components/PresentationMode'

export default function LLMRobustnessEval({ onComplete, onAlignmentComplete }: LLMRobustnessEvalProps) {
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const {
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
  } = useEvaluation()

  const calculateStats = (): EvaluationStats | null => {
    if (!results) return null

    return {
      jailbreakSuccess: results.jailbreak.filter(r => r.success).length,
      jailbreakTotal: results.jailbreak.length,
      gcgSuccess: results.gcg.filter(r => r.success).length,
      gcgTotal: results.gcg.length,
      pairRounds: results.pair.length,
      sycophancyAgreements: results.sycophancy.filter(r => r.agreed).length,
      sycophancyTotal: results.sycophancy.length,
      deceptionTriggered: results.deception.filter(r => r.deceptive).length,
      deceptionTotal: results.deception.length,
    }
  }

  const stats = calculateStats()

  // Handle callbacks
  if (results && onComplete) {
    onComplete(results)
  }
  
  if (alignmentMetrics && onAlignmentComplete) {
    onAlignmentComplete(alignmentMetrics)
  }

  // Return presentation mode if active
  if (isPresentationMode) {
    return <PresentationMode onExit={() => setIsPresentationMode(false)} />
  }

  // Check API key availability
  const hasOpenAI = isApiKeyAvailable()
  const hasAnthropic = isAnthropicApiKeyAvailable()
  const isClaudeModel = selectedModel.includes('claude')
  
  if (!hasOpenAI && !hasAnthropic) {
    return (
      <div className="py-20 px-6 bg-blue-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            🔬 LLM Robustness Evaluation
          </h2>
          <div className="p-8 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            <p>API keys not found. Please set at least one of:</p>
            <ul className="mt-2 text-sm">
              <li>VITE_OPENAI_API_KEY for OpenAI models</li>
              <li>VITE_ANTHROPIC_API_KEY for Claude models</li>
            </ul>
            <p className="mt-2 text-sm">OpenAI Status: {getApiKeyStatus()}</p>
            <p className="text-sm">Anthropic Status: {hasAnthropic ? 'Available' : 'Not found'}</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (isClaudeModel && !hasAnthropic) {
    return (
      <div className="py-20 px-6 bg-blue-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            🔬 LLM Robustness Evaluation
          </h2>
          <div className="p-8 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            <p>Anthropic API key required for Claude models.</p>
            <p className="mt-2 text-sm">Please set VITE_ANTHROPIC_API_KEY in your .env file.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsPresentationMode(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                       rounded-lg text-white font-medium transition-all flex items-center space-x-2"
            >
              <span>📽️</span>
              <span>Presentation Mode</span>
            </button>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🔬 <span style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>LLM Robustness</span> Evaluation
          </h2>
          <p className="text-xl text-white opacity-70 max-w-2xl mx-auto">
            Test various attack vectors, prompt injection techniques, and alignment degradation detection
          </p>
        </div>

        {/* Controls */}
        <EvaluationControls
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isRunning={isRunning}
          isRunningAlignment={isRunningAlignment}
          isRunningDegradation={isRunningDegradation}
          onRunEvaluation={handleRunEvaluation}
          onRunAlignmentMetrics={handleRunAlignmentMetrics}
          onRunDegradationDetection={handleRunDegradationDetection}
          onRunFullEvaluation={handleRunFullEvaluation}
          error={error}
          hasOpenAI={hasOpenAI}
          hasAnthropic={hasAnthropic}
        />

        {/* Alignment Degradation Results */}
        {degradationResults && (
          <div className="mb-8">
            <AlignmentDegradationResults result={degradationResults} />
          </div>
        )}

        {/* Alignment Metrics Dashboard */}
        {alignmentMetrics && (
          <div className="space-y-8">
            <AlignmentDashboard metrics={alignmentMetrics} />
          </div>
        )}

        {/* Attack Results */}
        {results && stats && (
          <AttackResults results={results} stats={stats} />
        )}
      </div>
    </div>
  )
}
