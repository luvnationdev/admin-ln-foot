import { env } from '@/env'
import type {
  ApiFixtureResponse,
  ApiLeagueResponse
} from './type'

import { INTERESTED_LEAGUES } from './constants'

const uniqueCountries = [...new Set(INTERESTED_LEAGUES.map((l) => l.country))]

export const fetchLeagues = async () => {
  const fetches = uniqueCountries.map((country) =>
    fetch(
      `https://api-football.com/v3/leagues?country=${encodeURIComponent(country)}`,
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
  const today = new Date().toISOString().split('T')[0]

  const fetches = INTERESTED_LEAGUES.map((league) =>
    fetch(
      `https://api-football.com/v3/fixtures?league=${league.id}&date=${today}`,
      {
        headers: { 'x-apisports-key': env.API_SPORTS_KEY },
      }
    ).then((res) => res.json() as Promise<ApiFixtureResponse>)
  )

  const results = await Promise.all(fetches)
  return results.flatMap((r) => r.response)
}
