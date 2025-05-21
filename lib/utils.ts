import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function calculateFinalScore(score: {
  halftime: { home: number | null; away: number | null }
  fulltime: { home: number | null; away: number | null }
  extratime: { home: number | null; away: number | null }
  penalty: { home: number | null; away: number | null }
}) {
  // Start with fulltime score
  let home = score.fulltime.home ?? score.halftime.home ?? 0
  let away = score.fulltime.away ??  score.halftime.away ?? 0

  // If extratime is available, use that instead
  if (score.extratime.home !== null && score.extratime.away !== null) {
    home = score.extratime.home
    away = score.extratime.away
  }

  // Penalties do not affect the total score, but can determine the winner
  let winner: 'home' | 'away' | 'draw' = 'draw'
  if (home > away) winner = 'home'
  else if (away > home) winner = 'away'
  else if (score.penalty.home !== null && score.penalty.away !== null) {
    if (score.penalty.home > score.penalty.away) winner = 'home'
    else if (score.penalty.away > score.penalty.home) winner = 'away'
  }

  return {
    home,
    away,
    winner,
  }
}
