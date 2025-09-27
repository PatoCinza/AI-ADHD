import type { AttackResult, EvaluationStats } from '../types'

interface AttackResultsProps {
  results: AttackResult
  stats: EvaluationStats
}

export default function AttackResults({ results, stats }: AttackResultsProps) {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="glass-card p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center font-display">
          📊 Attack Evaluation Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">
              {stats.jailbreakSuccess}/{stats.jailbreakTotal}
            </div>
            <div className="text-white/70 text-sm">Jailbreak Success</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">
              {stats.gcgSuccess}/{stats.gcgTotal}
            </div>
            <div className="text-white/70 text-sm">GCG Success</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">
              {stats.pairRounds}
            </div>
            <div className="text-white/70 text-sm">PAIR Rounds</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-2">
              {stats.sycophancyAgreements}/{stats.sycophancyTotal}
            </div>
            <div className="text-white/70 text-sm">Sycophancy</div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jailbreak Results */}
        <div className="glass-card p-6">
          <h4 className="text-xl font-bold text-white mb-4 font-display">🛡️ Jailbreak Attacks</h4>
          <div className="space-y-3">
            {results.jailbreak.map((result, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-white/80 mb-2 font-mono">
                  {result.prompt.length > 60 ? `${result.prompt.substring(0, 60)}...` : result.prompt}
                </div>
                <div className="text-xs text-white/60 mb-2">
                  Output: {result.output.length > 100 ? `${result.output.substring(0, 100)}...` : result.output}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  result.success
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                    : 'bg-green-500/20 text-green-300 border border-green-500/50'
                }`}>
                  {result.success ? '❌ Vulnerable' : '✅ Resistant'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GCG Results */}
        <div className="glass-card p-6">
          <h4 className="text-xl font-bold text-white mb-4 font-display">🎯 GCG Suffix Attacks</h4>
          <div className="space-y-3">
            {results.gcg.map((result, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-white/80 mb-2 font-mono">
                  {result.prompt.length > 60 ? `${result.prompt.substring(0, 60)}...` : result.prompt}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  result.success
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                    : 'bg-green-500/20 text-green-300 border border-green-500/50'
                }`}>
                  {result.success ? '❌ Vulnerable' : '✅ Resistant'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAIR Results */}
        <div className="glass-card p-6">
          <h4 className="text-xl font-bold text-white mb-4 font-display">⚡ PAIR Attack Loop</h4>
          <div className="space-y-3">
            {results.pair.map((result, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-white/80 mb-2">
                  Round {result.round}: {result.query?.length! > 60 ? `${result.query?.substring(0, 60)}...` : result.query}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  result.success
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                    : 'bg-green-500/20 text-green-300 border border-green-500/50'
                }`}>
                  {result.success ? '❌ Vulnerable' : '✅ Resistant'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sycophancy Results */}
        <div className="glass-card p-6">
          <h4 className="text-xl font-bold text-white mb-4 font-display">🤝 Sycophancy Evaluation</h4>
          <div className="space-y-3">
            {results.sycophancy.map((result, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-white/80 mb-2 font-mono">
                  {result.prompt.length > 60 ? `${result.prompt.substring(0, 60)}...` : result.prompt}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  result.agreed === result.expected
                    ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                    : 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                }`}>
                  {result.agreed === result.expected ? '✅ Consistent' : '⚠️ Sycophantic'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deception Results */}
      <div className="glass-card p-6">
        <h4 className="text-xl font-bold text-white mb-4 font-display">🎭 Deception Triggers</h4>
        <div className="space-y-3">
          {results.deception.map((result, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-white/80 mb-2 font-mono">
                {result.prompt.length > 60 ? `${result.prompt.substring(0, 60)}...` : result.prompt}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                result.deceptive
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                  : 'bg-green-500/20 text-green-300 border border-green-500/50'
              }`}>
                {result.deceptive ? '🎭 Triggered' : '✅ Normal'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
