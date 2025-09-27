import { useState, useEffect } from 'react'
import type { TrailElement } from '../types'
import { NOTIFICATION_MESSAGES, BACKGROUND_COLORS } from '../constants'

export function useAdhdEffects() {
  const [notifications, setNotifications] = useState<string[]>([])
  const [trailElements, setTrailElements] = useState<TrailElement[]>([])

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
      const randomMessage = NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)]
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
    const interval = setInterval(() => {
      const randomColor = BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)]
      document.body.className = `bg-gradient-to-br ${randomColor} min-h-screen`
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return {
    notifications,
    trailElements
  }
}
