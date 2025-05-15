type ApiError = {
  bug: string;
  time: string;
  report: string;
};

export type ApiFixtureResponse = {
  get: string;
  parameters: Record<string, string>;
  errors: ApiError;
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: ApiFixture[];
};

export type ApiFixture = {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string; // ISO 8601
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number;
      extra: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag?: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
};

export type ApiLeagueResponse = {
  get: string;
  parameters: Record<string, string>;
  errors: ApiError;
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: ApiLeague[];
};

export type ApiLeague = {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string;
    flag: string;
  };
  seasons: {
    year: number;
    start: string; // ISO date
    end: string; // ISO date
    current: boolean;
    coverage: {
      fixtures: {
        events: boolean;
        lineups: boolean;
        statistics_fixtures: boolean;
        statistics_players: boolean;
      };
      standings: boolean;
      players: boolean;
      top_scorers: boolean;
      top_assists: boolean;
      top_cards: boolean;
      injuries: boolean;
      predictions: boolean;
      odds: boolean;
    };
  }[];
};
