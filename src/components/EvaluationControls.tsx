import { MODEL_OPTIONS } from '../constants'

interface EvaluationControlsProps {
  selectedModel: string
  setSelectedModel: (model: string) => void
  isRunning: boolean
  isRunningAlignment: boolean
  onRunEvaluation: () => void
  onRunAlignmentMetrics: () => void
  error: string | null
}

export default function EvaluationControls({
  selectedModel,
  setSelectedModel,
  isRunning,
  isRunningAlignment,
  onRunEvaluation,
  onRunAlignmentMetrics,
  error
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
            {MODEL_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onRunEvaluation}
            disabled={isRunning || isRunningAlignment}
            className="adhd-button bg-gradient-to-r from-adhd-primary to-adhd-secondary text-white font-semibold py-4 px-8 rounded-xl focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Running Attack Evaluation...
              </div>
            ) : (
              "🚀 Run Attack Evaluation"
            )}
          </button>

          <button
            onClick={onRunAlignmentMetrics}
            disabled={isRunning || isRunningAlignment}
            className="adhd-button bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-4 px-8 rounded-xl focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunningAlignment ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Running Alignment Health Check...
              </div>
            ) : (
              "💊 Alignment Health Check"
            )}
          </button>
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
