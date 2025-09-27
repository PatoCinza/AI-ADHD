import type { AlignmentDegradationResult } from '../types'

interface Props {
  result: AlignmentDegradationResult
}

export default function AlignmentDegradationResults({ result }: Props) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-2xl font-bold text-white mb-4">Alignment Degradation Results</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {(result.baselineHarmlessness * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-300">Baseline Safe</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {(result.adversarialHarmlessness * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-300">Adversarial Safe</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {(result.harmlessnessDrop * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-300">Safety Drop</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${result.degradationDetected ? 'text-red-500' : 'text-green-500'}`}>
            {result.degradationDetected ? 'DETECTED' : 'NONE'}
          </div>
          <div className="text-sm text-gray-300">Degradation</div>
        </div>
      </div>

      <div className="text-sm text-gray-300">
        <p>Tested {result.summary.totalPrompts} prompts • {result.summary.flippedPrompts.length} flipped responses</p>
      </div>
    </div>
  )
}
