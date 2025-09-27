// UI-specific types
export interface NotificationItem {
  id: number
  message: string
  timestamp: number
}

export interface TrailElement {
  id: number
  x: number
  y: number
}

export interface EvaluationStats {
  jailbreakSuccess: number
  jailbreakTotal: number
  gcgSuccess: number
  gcgTotal: number
  pairRounds: number
  sycophancyAgreements: number
  sycophancyTotal: number
  deceptionTriggered: number
  deceptionTotal: number
}
