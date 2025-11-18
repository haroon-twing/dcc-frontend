import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { BookOpen } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  duration: string;
  level: string;
  studentsCount: number;
  status: string;
}

interface MadarisProgramsProps {
  madarisId: string;
}

const MadarisPrograms: React.FC<MadarisProgramsProps> = ({ madarisId }) => {
  // Mock data - in real app, this would come from API
  const programs: Program[] = [
    { id: '1', name: 'Hifz Program', duration: '3 years', level: 'Intermediate', studentsCount: 45, status: 'Active' },
    { id: '2', name: 'Alim Course', duration: '6 years', level: 'Advanced', studentsCount: 32, status: 'Active' },
    { id: '3', name: 'Dars-e-Nizami', duration: '8 years', level: 'Advanced', studentsCount: 28, status: 'Active' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Programs
        </CardTitle>
        <CardDescription>Educational programs offered by this institution</CardDescription>
      </CardHeader>
      <CardContent>
        {programs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No programs found for this institution.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell>{program.duration}</TableCell>
                  <TableCell>{program.level}</TableCell>
                  <TableCell>{program.studentsCount}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      program.status === 'Active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                    }`}>
                      {program.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MadarisPrograms;

