import { env } from '@/env'
import type {
  ApiFixtureResponse,
  ApiLeagueResponse,
  FixtureQueryParams,
} from './type'

import { INTERESTED_LEAGUES } from './constants'
import { toQueryParams } from '../utils'

const uniqueCountries = [...new Set(INTERESTED_LEAGUES.map((l) => l.country))]

export const fetchLeagues = async () => {
  const fetches = uniqueCountries.map((country) =>
    fetch(
      `${env.API_SPORTS_URL}/leagues?country=${encodeURIComponent(country)}`,
      {
        headers: {
          'X-RapidAPI-Key': env.API_SPORTS_KEY,
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        },
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

export const fetchFixtures = async (params: FixtureQueryParams) => {
  const results = await fetch(
    `${env.API_SPORTS_URL}/fixtures?${toQueryParams(params)}`,
    {
      headers: {
        'X-RapidAPI-Key': env.API_SPORTS_KEY,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
      },
    }
  ).then((res) => res.json() as Promise<ApiFixtureResponse>)

  const filterResults = results.response.filter((item) =>
    INTERESTED_LEAGUES.some(
      (l) => l.name === item.league.name && l.country === item.league.country
    )
  )

  return filterResults.length ? filterResults : results.response.slice(0, 10)
}
