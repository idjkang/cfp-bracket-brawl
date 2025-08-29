import { Team, SimulationConfig, SimulationResults, ChampionshipResult, TitleGameMatchup } from '@/types/cfp';

const K = 400.0; // Elo logistic scale

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  random(): number {
    // Simple linear congruential generator
    this.seed = (this.seed * 1664525 + 1013904223) % Math.pow(2, 32);
    return this.seed / Math.pow(2, 32);
  }
}

export function winProbability(ratingA: number, ratingB: number, eloDiffBonus: number = 0): number {
  return 1.0 / (1.0 + Math.pow(10, -((ratingA + eloDiffBonus) - ratingB) / K));
}

export function playGame(teamA: Team, teamB: Team, neutral: boolean = true, rng: SeededRandom, homeFieldAdvantage: number): string {
  const bonus = neutral ? 0 : homeFieldAdvantage;
  const prob = winProbability(teamA.rating, teamB.rating, bonus);
  return rng.random() < prob ? teamA.name : teamB.name;
}

export function simulateOnce(teams: Team[], rng: SeededRandom, homeFieldAdvantage: number): { champion: string; titleMatch: [string, string] } {
  const teamMap = new Map<string, Team>();
  teams.forEach(team => teamMap.set(team.name, team));

  // Seeds 1-12
  const seeds = teams.map(team => team.name);

  // First Round (5-8 host)
  const w_5_12 = playGame(teamMap.get(seeds[4])!, teamMap.get(seeds[11])!, false, rng, homeFieldAdvantage);
  const w_6_11 = playGame(teamMap.get(seeds[5])!, teamMap.get(seeds[10])!, false, rng, homeFieldAdvantage);
  const w_7_10 = playGame(teamMap.get(seeds[6])!, teamMap.get(seeds[9])!, false, rng, homeFieldAdvantage);
  const w_8_9 = playGame(teamMap.get(seeds[7])!, teamMap.get(seeds[8])!, false, rng, homeFieldAdvantage);

  // Quarterfinals (neutral)
  const q1 = playGame(teamMap.get(seeds[0])!, teamMap.get(w_8_9)!, true, rng, homeFieldAdvantage);
  const q2 = playGame(teamMap.get(seeds[3])!, teamMap.get(w_5_12)!, true, rng, homeFieldAdvantage);
  const q3 = playGame(teamMap.get(seeds[2])!, teamMap.get(w_6_11)!, true, rng, homeFieldAdvantage);
  const q4 = playGame(teamMap.get(seeds[1])!, teamMap.get(w_7_10)!, true, rng, homeFieldAdvantage);

  // Semifinals
  const semiA = playGame(teamMap.get(q1)!, teamMap.get(q2)!, true, rng, homeFieldAdvantage);
  const semiB = playGame(teamMap.get(q3)!, teamMap.get(q4)!, true, rng, homeFieldAdvantage);

  // Championship
  const champion = playGame(teamMap.get(semiA)!, teamMap.get(semiB)!, true, rng, homeFieldAdvantage);
  const titleMatch: [string, string] = [semiA, semiB].sort() as [string, string];

  return { champion, titleMatch };
}

export function runSimulation(config: SimulationConfig): SimulationResults {
  const rng = new SeededRandom(config.seed);
  const champCounts = new Map<string, number>();
  const titleGameCounts = new Map<string, number>();

  for (let i = 0; i < config.numSimulations; i++) {
    const { champion, titleMatch } = simulateOnce(config.teams, rng, config.homeFieldAdvantage);
    
    champCounts.set(champion, (champCounts.get(champion) || 0) + 1);
    
    const matchupKey = titleMatch.join(' vs ');
    titleGameCounts.set(matchupKey, (titleGameCounts.get(matchupKey) || 0) + 1);
  }

  // Convert to results format
  const championships: ChampionshipResult[] = Array.from(champCounts.entries())
    .map(([team, titles]) => ({
      team,
      titles,
      probability: titles / config.numSimulations
    }))
    .sort((a, b) => b.probability - a.probability);

  const titleGameMatchups: TitleGameMatchup[] = Array.from(titleGameCounts.entries())
    .map(([matchup, frequency]) => {
      const [teamA, teamB] = matchup.split(' vs ');
      return {
        teamA,
        teamB,
        frequency,
        probability: frequency / config.numSimulations
      };
    })
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 15);

  return {
    championships,
    titleGameMatchups
  };
}