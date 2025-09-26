import { useState, useEffect } from 'react'
import './App.css'
import LLMRobustnessEval from './LLMRobustnessEval'

function App() {
  const [notifications, setNotifications] = useState<string[]>([])
  const [trailElements, setTrailElements] = useState<Array<{id: number, x: number, y: number}>>([])

  // ADHD Cursor Trail
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      }
      setTrailElements(prev => [...prev.slice(-10), newTrail])
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // ADHD Random Notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        "⚡ FOCUS BOOST ACTIVATED! ⚡",
        "🧠 BRAIN CELLS FIRING! 🧠",
        "🎯 ATTENTION SPAN EXTENDED! 🎯",
        "🚀 PRODUCTIVITY MODE: ON! 🚀",
        "⚡ DOPAMINE HIT INCOMING! ⚡",
        "🎪 DISTRACTION AVERTED! 🎪",
        "🔥 MOTIVATION SURGE! 🔥",
        "⚡ HYPERFOCUS ACHIEVED! ⚡",
        "🎯 GOAL REACHED! 🎯",
        "🚀 ENERGY LEVEL: MAXIMUM! 🚀"
      ]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setNotifications(prev => [...prev.slice(-3), randomMessage])

      // Auto-remove notification after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.slice(1))
      }, 3000)
    }, 2000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [])

  // Modern subtle background changes
  useEffect(() => {
    const colors = [
      'from-indigo-500/20 via-purple-500/20 to-pink-500/20',
      'from-blue-500/20 via-cyan-500/20 to-emerald-500/20',
      'from-violet-500/20 via-purple-500/20 to-fuchsia-500/20',
      'from-sky-500/20 via-indigo-500/20 to-blue-500/20'
    ]

    const interval = setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      document.body.className = `bg-gradient-to-br ${randomColor} min-h-screen`
    }, 8000)

    return () => clearInterval(interval)
  }, [])


  return (
    <div className="adhd-cursor min-h-screen relative overflow-hidden">
      {/* Modern Cursor Trail */}
      {trailElements.map(trail => (
        <div
          key={trail.id}
          className="cursor-trail fixed pointer-events-none z-50"
          style={{
            left: trail.x - 8,
            top: trail.y - 8,
          }}
        />
      ))}

      {/* Modern Confetti - removed for now, can be triggered later */}

      {/* Modern Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-3 max-w-lg">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="notification-pop glass-card text-white px-20 py-10 rounded-2xl shadow-xl text-sm font-medium border border-white/20 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{notification}</span>
            </div>
          </div>
        ))}
      </div>

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

            <div className="text-lg text-adhd-warning font-comic mb-12">
              🎯 <strong>Focus</strong> • 🎪 <strong>Distract</strong> • 🚀 <strong>Achieve</strong> • 🔄 <strong>Repeat</strong> 🎯
            </div>
          </div>
        </div>
      </div>

      {/* LLM Robustness Evaluation Section */}
      <LLMRobustnessEval />

      {/* Modern Footer */}
      <footer className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-white mb-4 font-display">
              Built with <span className="text-gradient">❤️</span> and <span className="text-gradient">AI</span>
            </h3>
            <p className="text-xl text-white/80 mb-2">For the ADHD community</p>
            <p className="text-lg text-white/60">By neurodivergent minds, for neurodivergent minds</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['🎯 Focus', '🎪 Distract', '🚀 Achieve', '🔄 Repeat'].map((item, index) => (
              <span key={index} className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm font-medium">
                {item}
              </span>
            ))}
          </div>

          <div className="text-white/50 text-sm">
            © 2024 ADHD-GPT
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
