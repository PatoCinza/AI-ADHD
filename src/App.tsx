import './App.css'
import LLMRobustnessEval from './LLMRobustnessEval'
import { useAdhdEffects } from './hooks'
import { AdhdEffects } from './components'

function App() {
  const { notifications, trailElements } = useAdhdEffects()

  return (
    <div className="adhd-cursor min-h-screen relative overflow-hidden">
      <AdhdEffects trailElements={trailElements} notifications={notifications} />

      {/* Modern Header Section */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-[90vh] flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-7xl md:text-9xl font-black text-gradient mb-6 font-display animate-bounce-in">
              🧠 ADHD
            </h1>

            <p className="text-xl md:text-2xl text-white/80 font-light mb-8 max-w-2xl mx-auto">
              <span className="text-gradient">⚡</span> <em>Alignment Degradation Helpful Detection</em> <span className="text-gradient">⚡</span>
            </p>
          </div>
        </div>
      </div>

      {/* LLM Robustness Evaluation Section */}
      <LLMRobustnessEval />

      {/* Modern Footer */}
      <footer className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-white/50 text-sm">
            © 2024 ADHD-GPT
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
