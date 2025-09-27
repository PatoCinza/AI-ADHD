import type { TrailElement } from '../types'

interface AdhdEffectsProps {
  trailElements: TrailElement[]
  notifications: string[]
}

export default function AdhdEffects({ trailElements, notifications }: AdhdEffectsProps) {
  return (
    <>
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
    </>
  )
}
