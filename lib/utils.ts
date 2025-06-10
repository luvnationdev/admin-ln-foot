import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { FixtureQueryParams } from './api-football/type'

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
  let away = score.fulltime.away ?? score.halftime.away ?? 0

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

export function toQueryParams(params: FixtureQueryParams): string {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value))
    }
  })

  return query.toString()
}

export function getMinioObjectPublicUrl(endpoint: string, objectPath: string) {
  return process.env.NODE_ENV === 'production'
    ? `https://${endpoint}/${objectPath}`
    : `http://${endpoint}:9000/${objectPath}`
}

export function isValidColorCode(colorCode: string): boolean {
  // Check if the color code is a valid hex code
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
  return hexRegex.test(colorCode)
}

export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return (
      ['http:', 'https:'].includes(parsedUrl.protocol) &&
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
    )
  } catch {
    return false
  }
}
