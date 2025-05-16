import { env } from '@/env'
import type { ApiFixtureResponse, ApiLeagueResponse } from './type'

import { INTERESTED_LEAGUES } from './constants'

const uniqueCountries = [...new Set(INTERESTED_LEAGUES.map((l) => l.country))]

export const fetchLeagues = async () => {
  const fetches = uniqueCountries.map((country) =>
    fetch(
      `${env.API_SPORTS_URL}/leagues?country=${encodeURIComponent(country)}`,
      {
        headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY! },
      }
    ).then((res) => res.json() as Promise<ApiLeagueResponse>)
  )

  const results = await Promise.all(fetches)
  const allLeagues = results.flatMap((r) => r.response)

  const targetNames = INTERESTED_LEAGUES.map((l) => l.name.toLowerCase())
  return allLeagues.filter((l) =>
    targetNames.includes(l.league.name.toLowerCase())
  )
}

export const fetchFixtures = async () => {
  const today = new Date()

  const fromDate = new Date(today)
  fromDate.setDate(fromDate.getDate() - 2) // 2 days before today
  const from = fromDate.toISOString().split('T')[0]

  const toDate = new Date(today)
  toDate.setDate(toDate.getDate() + 4) // 4 days after today
  const to = toDate.toISOString().split('T')[0]

  const results = await fetch(
    `${env.API_SPORTS_URL}/fixtures?from=${from}&to=${to}`,
    {
      headers: { 'x-apisports-key': env.API_SPORTS_KEY },
    }
  ).then((res) => res.json() as Promise<ApiFixtureResponse>)

  return results.response.filter((item) =>
    INTERESTED_LEAGUES.some(
      (l) => l.name === item.league.name && l.country === item.league.country
    )
  )
}
