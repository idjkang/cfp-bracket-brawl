import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Trophy, Target, Users, Settings } from 'lucide-react';
import { Team, SimulationConfig, SimulationResults } from '@/types/cfp';
import { runSimulation } from '@/lib/cfp-simulator';
import { TeamsTable } from './TeamsTable';
import { ResultsTable } from './ResultsTable';
import { TitleGameTable } from './TitleGameTable';

const DEFAULT_TEAMS: Team[] = [
  { name: "Texas", rating: 1980 },
  { name: "Penn State", rating: 1955 },
  { name: "Ohio State", rating: 1970 },
  { name: "Clemson", rating: 1925 },
  { name: "Georgia", rating: 1960 },
  { name: "Notre Dame", rating: 1920 },
  { name: "Oregon", rating: 1935 },
  { name: "Alabama", rating: 1945 },
  { name: "LSU", rating: 1930 },
  { name: "Miami", rating: 1890 },
  { name: "Arizona State", rating: 1840 },
  { name: "Boise State", rating: 1810 }
];

export function CFPSimulator() {
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [homeFieldAdvantage, setHomeFieldAdvantage] = useState(55);
  const [numSimulations, setNumSimulations] = useState(50000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const config: SimulationConfig = {
        teams,
        homeFieldAdvantage,
        numSimulations,
        seed: 2025
      };

      const simulationResults = runSimulation(config);
      setResults(simulationResults);
      setIsSimulating(false);
    }, 100);
  };

  const updateTeam = (index: number, field: 'name' | 'rating', value: string | number) => {
    const updatedTeams = [...teams];
    updatedTeams[index] = { ...updatedTeams[index], [field]: value };
    setTeams(updatedTeams);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-cfp-blue to-cfp-navy text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="h-10 w-10 text-cfp-gold" />
            <div>
              <h1 className="text-4xl font-bold">CFP 2025 Monte Carlo Simulator</h1>
              <p className="text-blue-100 text-lg">12-Team College Football Playoff Predictor</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cfp-gold" />
              <span>Top 4 seeds get byes</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-cfp-gold" />
              <span>First round: 12@5, 11@6, 10@7, 9@8</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-cfp-gold" />
              <span>Quarterfinals+ neutral sites</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Simulation Parameters */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-cfp-blue" />
                  Simulation Parameters
                </CardTitle>
                <CardDescription>
                  Adjust the simulation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hfa">Home Field Advantage (Elo Points)</Label>
                  <Input
                    id="hfa"
                    type="number"
                    value={homeFieldAdvantage}
                    onChange={(e) => setHomeFieldAdvantage(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sims">Number of Simulations</Label>
                  <Input
                    id="sims"
                    type="number"
                    value={numSimulations}
                    onChange={(e) => setNumSimulations(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleSimulate} 
                  disabled={isSimulating}
                  className="w-full bg-gradient-to-r from-cfp-blue to-cfp-navy hover:from-cfp-navy hover:to-cfp-blue text-white shadow-elegant"
                >
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </Button>
              </CardContent>
            </Card>

            {/* Teams Configuration */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-cfp-blue" />
                  Team Configuration
                </CardTitle>
                <CardDescription>
                  Teams listed in seed order with Elo ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamsTable teams={teams} onUpdateTeam={updateTeam} />
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {results ? (
              <>
                {/* Championship Probabilities */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-champion-purple" />
                      National Championship Probabilities
                    </CardTitle>
                    <CardDescription>
                      Based on {numSimulations.toLocaleString()} Monte Carlo simulations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResultsTable results={results.championships} />
                  </CardContent>
                </Card>

                <Separator />

                {/* Title Game Matchups */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-playoff-green" />
                      Most Common Title Game Matchups
                    </CardTitle>
                    <CardDescription>
                      Top 15 most likely championship game pairings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TitleGameTable matchups={results.titleGameMatchups} />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-card">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    Ready to Simulate
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Configure your teams and parameters, then run the simulation to see championship probabilities.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}