import type { LLMRobustnessEvalProps, EvaluationStats } from './types'
import { isApiKeyAvailable, getApiKeyStatus } from './services'
import { useEvaluation } from './hooks'
import { EvaluationControls, AlignmentDashboard, AttackResults } from './components'

export default function LLMRobustnessEval({ onComplete, onAlignmentComplete }: LLMRobustnessEvalProps) {
  const {
    isRunning,
    isRunningAlignment,
    results,
    alignmentMetrics,
    selectedModel,
    setSelectedModel,
    error,
    handleRunEvaluation,
    handleRunAlignmentMetrics
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

  // Simple render first to test
  if (!isApiKeyAvailable()) {
    return (
      <div className="py-20 px-6 bg-blue-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            🔬 LLM Robustness Evaluation
          </h2>
          <div className="p-8 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            <p>OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.</p>
            <p className="mt-2 text-sm">Current value: {getApiKeyStatus()}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🔬 <span style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>LLM Robustness</span> Evaluation
          </h2>
          <p className="text-xl text-white opacity-70 max-w-2xl mx-auto">
            Test various attack vectors and prompt injection techniques on language models
          </p>
        </div>

        {/* Controls */}
        <EvaluationControls
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isRunning={isRunning}
          isRunningAlignment={isRunningAlignment}
          onRunEvaluation={handleRunEvaluation}
          onRunAlignmentMetrics={handleRunAlignmentMetrics}
          error={error}
        />

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
