import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Team } from '@/types/cfp';

interface TeamsTableProps {
  teams: Team[];
  onUpdateTeam: (index: number, field: 'name' | 'rating', value: string | number) => void;
}

export function TeamsTable({ teams, onUpdateTeam }: TeamsTableProps) {
  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Seed</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="w-24">Elo Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-cfp-blue">
                {index + 1}
              </TableCell>
              <TableCell>
                <Input
                  value={team.name}
                  onChange={(e) => onUpdateTeam(index, 'name', e.target.value)}
                  className="border-0 px-0 focus:ring-0 bg-transparent"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={team.rating}
                  onChange={(e) => onUpdateTeam(index, 'rating', Number(e.target.value))}
                  className="w-20 text-center"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}