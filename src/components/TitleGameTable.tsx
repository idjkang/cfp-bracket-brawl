import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TitleGameMatchup } from '@/types/cfp';

interface TitleGameTableProps {
  matchups: TitleGameMatchup[];
}

export function TitleGameTable({ matchups }: TitleGameTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Matchup</TableHead>
          <TableHead className="w-24 text-right">Frequency</TableHead>
          <TableHead className="w-28 text-right">Probability</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matchups.map((matchup, index) => (
          <TableRow key={`${matchup.teamA}-${matchup.teamB}`} className={index < 3 ? "bg-muted/30" : ""}>
            <TableCell className="text-center text-muted-foreground">
              {index + 1}
            </TableCell>
            <TableCell className="font-medium">
              <span className="text-cfp-blue">{matchup.teamA}</span>
              <span className="text-muted-foreground mx-2">vs</span>
              <span className="text-cfp-blue">{matchup.teamB}</span>
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {matchup.frequency.toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-medium">
              <span className={index === 0 ? "text-playoff-green font-bold" : ""}>
                {(matchup.probability * 100).toFixed(2)}%
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}