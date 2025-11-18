import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../UI/Table';
import { Book } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  instructor: string;
  status: string;
}

interface MadarisCoursesProps {
  madarisId: string;
}

const MadarisCourses: React.FC<MadarisCoursesProps> = ({ madarisId }) => {
  // Mock data - in real app, this would come from API
  const courses: Course[] = [
    { id: '1', name: 'Quran Recitation', code: 'QUR-101', credits: 3, instructor: 'Maulana Ahmed Ali', status: 'Active' },
    { id: '2', name: 'Hadith Studies', code: 'HAD-201', credits: 4, instructor: 'Maulana Hassan Raza', status: 'Active' },
    { id: '3', name: 'Fiqh Principles', code: 'FIQ-301', credits: 4, instructor: 'Maulana Usman Khan', status: 'Active' },
    { id: '4', name: 'Arabic Language', code: 'ARA-101', credits: 3, instructor: 'Maulana Ahmed Ali', status: 'Active' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Courses
        </CardTitle>
        <CardDescription>Individual courses offered by this institution</CardDescription>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No courses found for this institution.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell className="font-mono text-sm">{course.code}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.status === 'Active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                    }`}>
                      {course.status}
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

export default MadarisCourses;

