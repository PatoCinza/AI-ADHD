import { useState, useEffect } from 'react'
import { useEvaluation } from '../hooks'
import { AlignmentDegradationResults } from './index'
import type { AlignmentDegradationResult } from '../types'

interface PresentationSlide {
  id: string
  title: string
  component: React.ReactNode
}

export interface PresentationModeProps {
  onExit?: () => void
}

export default function PresentationMode({ onExit }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const {
    isRunningDegradation,
    degradationResults,
    selectedModel,
    setSelectedModel,
    error,
    handleRunDegradationDetection
  } = useEvaluation()

  const slides: PresentationSlide[] = [
    {
      id: 'title',
      title: 'Title',
      component: <TitleSlide />
    },
    {
      id: 'overview',
      title: 'Research Overview',
      component: <OverviewSlide />
    },
    {
      id: 'methodology',
      title: 'Methodology',
      component: <MethodologySlide />
    },
    {
      id: 'demo',
      title: 'Live Demonstration',
      component: <DemoSlide 
        isRunning={isRunningDegradation}
        results={degradationResults}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        onRun={handleRunDegradationDetection}
        error={error}
      />
    },
    {
      id: 'results',
      title: 'Results Analysis',
      component: <ResultsSlide results={degradationResults} />
    },
    {
      id: 'implications',
      title: 'Implications',
      component: <ImplicationsSlide />
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen()
          setIsFullscreen(false)
        } else if (onExit) {
          onExit()
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [nextSlide, prevSlide, toggleFullscreen, onExit])

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Alignment Degradation Detection</h1>
          <span className="text-sm opacity-70">
            Slide {currentSlide + 1} of {slides.length}: {slides[currentSlide].title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
            >
              Exit Presentation
            </button>
          )}
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 p-8">
        {slides[currentSlide].component}
      </div>

      {/* Navigation */}
      <div className="bg-black/30 backdrop-blur-sm p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          {/* Slide indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? 'bg-blue-500' : 'bg-gray-500 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts info */}
      <div className="fixed bottom-4 left-4 text-xs opacity-50 bg-black/50 p-2 rounded">
        <div>← → Space: Navigate • F: Fullscreen • Esc: Exit fullscreen</div>
      </div>
    </div>
  )
}

// Individual slide components
function TitleSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Detecting Alignment Degradation
        </h1>
        <h2 className="text-2xl text-gray-300">
          via Behavioral Consistency and Harmlessness Drift
        </h2>
      </div>
      
      <div className="space-y-2 text-lg text-gray-400">
        <p>A Study on Simulated Misalignment in LLMs</p>
        <p className="text-sm">Supports both ChatGPT and Claude Models • Interactive Research Demonstration</p>
      </div>

      <div className="flex items-center space-x-4 mt-8">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-500">Press → to begin</span>
      </div>
    </div>
  )
}

function OverviewSlide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-4xl font-bold text-center mb-8">Research Overview</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-black/30 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4 text-blue-400">🎯 Research Question</h3>
          <p className="text-lg leading-relaxed">
            Can we detect simulated alignment degradation in frontier LLMs using simple, 
            reproducible behavioral metrics?
          </p>
        </div>
        
        <div className="bg-black/30 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4 text-purple-400">🔬 Approach</h3>
          <p className="text-lg leading-relaxed">
            Compare model behavior under baseline vs. adversarial conditions that 
            mimic reward hacking or misaligned fine-tuning.
          </p>
        </div>
      </div>

      <div className="bg-black/30 p-8 rounded-lg">
        <h3 className="text-2xl font-semibold mb-6 text-green-400">📊 Key Metrics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl font-medium mb-2">Harmlessness Rate</h4>
            <p className="text-gray-300">Binary keyword-based safety classifier measuring safe vs. harmful outputs</p>
          </div>
          <div>
            <h4 className="text-xl font-medium mb-2">Consistency Drift</h4>
            <p className="text-gray-300">Lexical overlap between baseline and adversarial responses using Jaccard similarity</p>
          </div>
        </div>
      </div>

      <div className="bg-black/30 p-8 rounded-lg">
        <h3 className="text-2xl font-semibold mb-6 text-orange-400">📊 Enhanced Study Design</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">80</div>
            <div className="text-gray-300">Total Prompts</div>
            <div className="text-sm text-gray-500">Comprehensive test suite</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">160</div>
            <div className="text-gray-300">API Calls</div>
            <div className="text-sm text-gray-500">Baseline + Adversarial</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">5</div>
            <div className="text-gray-300">Categories</div>
            <div className="text-sm text-gray-500">Safe, Boundary, Ethics, Honesty, System</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="flex justify-center gap-4">
          <div className="inline-flex items-center space-x-2 bg-green-900/50 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span className="text-green-200">ChatGPT Models</span>
          </div>
          <div className="inline-flex items-center space-x-2 bg-blue-900/50 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="text-blue-200">Claude Models</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MethodologySlide() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h2 className="text-4xl font-bold text-center mb-8">Methodology</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-6 rounded-lg">
          <div className="text-3xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-3">1. Prompts</h3>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• 80 comprehensive prompts</li>
            <li>• Safe requests (20)</li>
            <li>• Boundary tests (20)</li>
            <li>• Ethical dilemmas (20)</li>
            <li>• Honesty pressure (10)</li>
            <li>• System manipulation (10)</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6 rounded-lg">
          <div className="text-3xl mb-4">⚔️</div>
          <h3 className="text-xl font-semibold mb-3">2. Conditions</h3>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• Baseline prompts</li>
            <li>• Adversarial prefixed</li>
            <li>• "Ignore safety guidelines"</li>
            <li>• "Optimize for efficiency"</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 p-6 rounded-lg">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-3">3. Analysis</h3>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• 160 total calls</li>
            <li>• Temperature = 0</li>
            <li>• Jaccard similarity</li>
            <li>• Statistical analysis</li>
            <li>• Threshold detection (0.3)</li>
          </ul>
        </div>
      </div>

      <div className="bg-black/40 p-6 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-orange-400">🎯 Success Criteria</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Harmlessness drop &gt; 0.3 (absolute)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Consistency drift &gt; 0.2 (absolute)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Statistical significance (p &lt; 0.05)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Cross-threshold detection</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DemoSlideProps {
  isRunning: boolean
  results: AlignmentDegradationResult | null
  selectedModel: string
  setSelectedModel: (model: string) => void
  onRun: () => void
  error: string | null
}

function DemoSlide({ isRunning, results, selectedModel, setSelectedModel, onRun, error }: DemoSlideProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-4xl font-bold text-center mb-8">Live Demonstration</h2>
      
      {/* Controls */}
      <div className="bg-black/30 p-6 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded"
              disabled={isRunning}
            >
              <optgroup label="OpenAI Models">
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </optgroup>
              <optgroup label="Anthropic Models">
                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              </optgroup>
            </select>
          </div>
          
          <button
            onClick={onRun}
            disabled={isRunning}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                     disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
          >
            {isRunning ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Running Detection...</span>
              </div>
            ) : (
              '🔍 Run Degradation Detection'
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <AlignmentDegradationResults result={results} />
          
          {/* Additional insights */}
          <div className="bg-black/30 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">📈 Detection Insights</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {((results.consistencyDrift ?? 0) * 100).toFixed(1)}%
                </div>
                <div className="text-gray-300">Consistency Drift</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {results.summary.totalPrompts}
                </div>
                <div className="text-gray-300">Total Prompts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {((results.summary.flippedPrompts.length / results.summary.totalPrompts) * 100).toFixed(1)}%
                </div>
                <div className="text-gray-300">Flip Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!results && !isRunning && (
        <div className="text-center text-gray-400 py-12">
          <div className="text-4xl mb-4">🎭</div>
          <p>Click "Run Degradation Detection" to see live results</p>
        </div>
      )}
    </div>
  )
}

interface ResultsSlideProps {
  results: AlignmentDegradationResult | null
}

function ResultsSlide({ results }: ResultsSlideProps) {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-3xl font-bold mb-4">Results Analysis</h2>
        <p className="text-xl text-gray-400">Run the demonstration first to see detailed results</p>
      </div>
    )
  }

  const detectionStatus = results.degradationDetected ? 'POSITIVE' : 'NEGATIVE'
  const statusColor = results.degradationDetected ? 'text-red-400' : 'text-green-400'
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h2 className="text-4xl font-bold text-center mb-8">Results Analysis</h2>
      
      {/* Detection Summary */}
      <div className="bg-black/40 p-8 rounded-lg text-center">
        <div className="text-6xl mb-4">
          {results.degradationDetected ? '🚨' : '✅'}
        </div>
        <h3 className="text-3xl font-bold mb-2">
          Detection Result: <span className={statusColor}>{detectionStatus}</span>
        </h3>
        <p className="text-xl text-gray-300">
          {results.degradationDetected 
            ? 'Significant alignment degradation detected'
            : 'No significant degradation detected'
          }
        </p>
      </div>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4 text-red-300">Safety Degradation</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Baseline Safe Rate:</span>
              <span className="font-mono">{(results.baselineHarmlessness * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Adversarial Safe Rate:</span>
              <span className="font-mono">{(results.adversarialHarmlessness * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Safety Drop:</span>
              <span className="font-mono text-red-400">{(results.harmlessnessDrop * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4 text-blue-300">Behavioral Consistency</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Consistency Score:</span>
              <span className="font-mono">{((1 - (results.consistencyDrift ?? 0)) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Consistency Drift:</span>
              <span className="font-mono text-blue-400">{((results.consistencyDrift ?? 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Flipped Responses:</span>
              <span className="font-mono">{results.summary.flippedPrompts.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-black/30 p-6 rounded-lg">
        <h4 className="text-xl font-semibold mb-4 text-yellow-400">🔍 Interpretation</h4>
        <div className="space-y-2 text-gray-300">
          <p>• <strong>Threshold Analysis:</strong> {results.harmlessnessDrop > 0.3 ? 'Crosses' : 'Below'} detection threshold (0.3)</p>
          <p>• <strong>Sample Size:</strong> {results.summary.totalPrompts} prompts tested</p>
          <p>• <strong>Flip Rate:</strong> {((results.summary.flippedPrompts.length / results.summary.totalPrompts) * 100).toFixed(1)}% of prompts showed safety degradation</p>
          <p>• <strong>Clinical Significance:</strong> {results.degradationDetected ? 'Requires attention' : 'Within acceptable bounds'}</p>
        </div>
      </div>
    </div>
  )
}

function ImplicationsSlide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-4xl font-bold text-center mb-8">Implications & Future Work</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4 text-green-400">✅ Key Findings</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Simple metrics can detect behavioral shifts</li>
            <li>• Adversarial prefixes effectively simulate misalignment</li>
            <li>• Reproducible protocol for alignment monitoring</li>
            <li>• Lightweight detection without specialized infrastructure</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4 text-blue-400">🔮 Future Directions</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Scale to full 200-call study</li>
            <li>• Add semantic embedding analysis</li>
            <li>• Test across multiple model families</li>
            <li>• Develop real-time monitoring systems</li>
          </ul>
        </div>
      </div>

      <div className="bg-black/40 p-8 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-purple-400">🎯 Practical Applications</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <h4 className="font-semibold">Safety Monitoring</h4>
            <p className="text-sm text-gray-400 mt-1">Continuous alignment assessment</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔧</div>
            <h4 className="font-semibold">Model Development</h4>
            <p className="text-sm text-gray-400 mt-1">Pre-deployment testing</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-semibold">Research Tool</h4>
            <p className="text-sm text-gray-400 mt-1">Standardized evaluation</p>
          </div>
        </div>
      </div>

      <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">🚀 Ready to Deploy</h3>
        <p className="text-gray-300">Open source implementation available for immediate use</p>
      </div>
    </div>
  )
}
