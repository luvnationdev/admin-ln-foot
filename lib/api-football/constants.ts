import type { Pageable } from "../api-client/rq-generated/requests"

export const INTERESTED_LEAGUES = [
  // Cameroun
  { name: 'Elite One', country: 'Cameroon' },
  { name: 'Elite Two', country: 'Cameroon' },

  // France
  { name: 'Ligue 1', country: 'France' },
  { name: 'Ligue 2', country: 'France' },
  { name: 'Feminine Division 1', country: 'France' }, // Première ligue Arkema

  // England
  { name: 'Premier League', country: 'England' },
  { name: 'Championship', country: 'England' },
  { name: 'League One', country: 'England' },

  // Spain
  { name: 'La Liga', country: 'Spain' },
  { name: 'Segunda División', country: 'Spain' },
  { name: 'Primera RFEF', country: 'Spain' }, // Liga 3

  // Italy
  { name: 'Serie A', country: 'Italy' },
  { name: 'Serie B', country: 'Italy' },
  { name: 'Serie C', country: 'Italy' },

  // Germany
  { name: 'Bundesliga', country: 'Germany' },
  { name: '2. Bundesliga', country: 'Germany' },

  // Latvia
  { name: 'Virsliga', country: 'Latvia' },

  // Romania
  { name: 'Liga I', country: 'Romania' },

  // USA
  { name: 'Major League Soccer', country: 'USA' },
  { name: 'MLS Next Pro', country: 'USA' },

  // China
  { name: 'Super League', country: 'China' },

  // Saudi Arabia
  { name: 'Saudi Professional League', country: 'Saudi Arabia' },

  // Tanzania
  { name: 'NBC Premier League', country: 'Tanzania' },
]

export const DEFAULT_HIGHLIGHTS_PAGINATION: Pageable = {
  page: 0,
  size: 20,
  sort: ['createdAt,desc'],
}
