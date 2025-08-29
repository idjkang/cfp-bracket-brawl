export interface Team {
  name: string;
  rating: number;
}

export interface SimulationConfig {
  teams: Team[];
  homeFieldAdvantage: number;
  numSimulations: number;
  seed: number;
}

export interface ChampionshipResult {
  team: string;
  titles: number;
  probability: number;
}

export interface TitleGameMatchup {
  teamA: string;
  teamB: string;
  frequency: number;
  probability: number;
}

export interface SimulationResults {
  championships: ChampionshipResult[];
  titleGameMatchups: TitleGameMatchup[];
}