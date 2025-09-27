import type { AlignmentMetrics } from '../types'

interface AlignmentDashboardProps {
  metrics: AlignmentMetrics
}

export default function AlignmentDashboard({ metrics }: AlignmentDashboardProps) {
  const getHealthStatus = (score: number) => {
    if (score >= 0.8) return { text: '✅ Healthy', class: 'bg-green-500/20 text-green-300 border-green-500/50' }
    if (score >= 0.6) return { text: '⚠️ Moderate Risk', class: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' }
    return { text: '🚨 High Risk', class: 'bg-red-500/20 text-red-300 border-red-500/50' }
  }

  const healthStatus = getHealthStatus(metrics.alignmentHealthScore)

  return (
    <div className="glass-card p-8">
      <h3 className="text-3xl font-bold text-white mb-6 text-center font-display">
        💊 Alignment Health Dashboard
      </h3>
      
      {/* Overall Health Score */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-gradient mb-4">
          {(metrics.alignmentHealthScore * 100).toFixed(1)}%
        </div>
        <div className="text-xl text-white/80 mb-2">Overall Alignment Health Score</div>
        <div className={`text-lg font-semibold px-4 py-2 rounded-full inline-block border ${healthStatus.class}`}>
          {healthStatus.text}
        </div>
      </div>

      {/* Core Behavioral Metrics */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-white mb-4 font-display">🔹 Core Behavioral Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">
              {(metrics.refusalRate * 100).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Refusal Rate</div>
            <div className="text-xs text-white/50">Harmful prompts refused</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">
              {(metrics.attackSuccessRate * 100).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Attack Success Rate</div>
            <div className="text-xs text-white/50">Jailbreaks succeeded</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">
              {(metrics.honestyUnderPressure * 100).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Honesty Under Pressure</div>
            <div className="text-xs text-white/50">Truth maintained</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">
              {(metrics.sycophancyRate * 100).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Sycophancy Rate</div>
            <div className="text-xs text-white/50">Incorrect agreements</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">
              {(metrics.selfConsistency * 100).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Self-Consistency</div>
            <div className="text-xs text-white/50">Response consistency</div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-white mb-4 font-display">🔹 Secondary Metrics (Alignment Vitals)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient mb-2">
              {(metrics.evasionRate * 100).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Evasion Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient mb-2">
              {(metrics.valueRobustness * 100).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Value Robustness</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient mb-2">
              {(metrics.goalAdherence * 100).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Goal Adherence</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient mb-2">
              {(metrics.toxicityRate * 100).toFixed(1)}%
            </div>
            <div className="text-white/70 text-sm">Toxicity Rate</div>
          </div>
        </div>
      </div>

      {/* Test Summary */}
      <div className="bg-white/5 rounded-lg p-6">
        <h4 className="text-lg font-bold text-white mb-3 font-display">📋 Test Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white mb-1">{metrics.totalPrompts}</div>
            <div className="text-white/60 text-sm">Total Prompts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-300 mb-1">{metrics.harmfulPrompts}</div>
            <div className="text-white/60 text-sm">Harmful Tests</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-300 mb-1">{metrics.safePrompts}</div>
            <div className="text-white/60 text-sm">Safe Tests</div>
          </div>
        </div>
      </div>
    </div>
  )
}
