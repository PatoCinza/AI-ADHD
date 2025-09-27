import { MODEL_OPTIONS } from '../constants'

interface EvaluationControlsProps {
  selectedModel: string
  setSelectedModel: (model: string) => void
  isRunning: boolean
  isRunningAlignment: boolean
  isRunningDegradation?: boolean
  onRunEvaluation: () => void
  onRunAlignmentMetrics: () => void
  onRunDegradationDetection?: () => void
  onRunFullEvaluation?: () => void
  error: string | null
  hasOpenAI?: boolean
  hasAnthropic?: boolean
}

export default function EvaluationControls({
  selectedModel,
  setSelectedModel,
  isRunning,
  isRunningAlignment,
  isRunningDegradation = false,
  onRunEvaluation,
  onRunAlignmentMetrics,
  onRunDegradationDetection,
  onRunFullEvaluation,
  error,
  hasOpenAI = true,
  hasAnthropic = false
}: EvaluationControlsProps) {
  return (
    <div className="glass-card p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <label className="text-white font-medium">Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-adhd-primary focus:outline-none"
            disabled={isRunning}
          >
            {MODEL_OPTIONS.map(option => {
              const isClaudeModel = option.value.includes('claude')
              const isDisabled = (isClaudeModel && !hasAnthropic) || (!isClaudeModel && !hasOpenAI)
              return (
                <option key={option.value} value={option.value} disabled={isDisabled}>
                  {option.label} {isDisabled ? '(API key required)' : ''}
                </option>
              )
            })}
          </select>
          
          {/* API Key Status Indicators */}
          <div className="flex gap-3 text-xs text-white/70">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${hasOpenAI ? 'bg-green-400' : 'bg-red-400'}`}></div>
              OpenAI {hasOpenAI ? 'Ready' : 'Missing'}
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${hasAnthropic ? 'bg-green-400' : 'bg-red-400'}`}></div>
              Anthropic {hasAnthropic ? 'Ready' : 'Missing'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Traditional Attack Evaluation */}
          <button
            onClick={onRunEvaluation}
            disabled={isRunning || isRunningAlignment || isRunningDegradation || 
              (selectedModel.includes('claude') ? !hasAnthropic : !hasOpenAI)}
            className="adhd-button bg-gradient-to-r from-adhd-primary to-adhd-secondary text-white font-semibold py-3 px-6 rounded-xl focus-ring disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Running...
              </div>
            ) : (
              "🚀 Attack Evaluation"
            )}
          </button>

          {/* Alignment Health Check - OpenAI only for now */}
          <button
            onClick={onRunAlignmentMetrics}
            disabled={isRunning || isRunningAlignment || isRunningDegradation || !hasOpenAI}
            className="adhd-button bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl focus-ring disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isRunningAlignment ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Running...
              </div>
            ) : (
              "💊 Alignment Health"
            )}
          </button>

          {/* Alignment Degradation Detection - Works with both providers */}
          {onRunDegradationDetection && (
            <button
              onClick={onRunDegradationDetection}
              disabled={isRunning || isRunningAlignment || isRunningDegradation || 
                (selectedModel.includes('claude') ? !hasAnthropic : !hasOpenAI)}
              className="adhd-button bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl focus-ring disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isRunningDegradation ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Detecting...
                </div>
              ) : (
                "🔍 Degradation Detection"
              )}
            </button>
          )}

          {/* Full Evaluation Suite - Works with both providers */}
          {onRunFullEvaluation && (
            <button
              onClick={onRunFullEvaluation}
              disabled={isRunning || isRunningAlignment || isRunningDegradation ||
                (selectedModel.includes('claude') ? !hasAnthropic : !hasOpenAI)}
              className="adhd-button bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl focus-ring disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isRunning ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Running Full...
                </div>
              ) : (
                "⚡ Full Evaluation"
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
          {error}
        </div>
      )}
    </div>
  )
}
