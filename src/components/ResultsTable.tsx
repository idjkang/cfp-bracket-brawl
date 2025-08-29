import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChampionshipResult } from '@/types/cfp';

interface ResultsTableProps {
  results: ChampionshipResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  const getPositionBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-cfp-gold text-cfp-navy">1st</Badge>;
    if (index === 1) return <Badge className="bg-muted text-muted-foreground">2nd</Badge>;
    if (index === 2) return <Badge className="bg-muted text-muted-foreground">3rd</Badge>;
    return null;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="w-24 text-right">Titles</TableHead>
          <TableHead className="w-28 text-right">Probability</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result, index) => (
          <TableRow key={result.team} className={index < 3 ? "bg-muted/30" : ""}>
            <TableCell className="text-center">
              {getPositionBadge(index) || <span className="text-muted-foreground">{index + 1}</span>}
            </TableCell>
            <TableCell className="font-medium">
              {result.team}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {result.titles.toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-medium">
              <span className={index === 0 ? "text-champion-purple font-bold" : ""}>
                {(result.probability * 100).toFixed(1)}%
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}