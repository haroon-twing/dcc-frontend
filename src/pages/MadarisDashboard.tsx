import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';

const MadarisDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Madaris', value: 24, description: 'Registered institutions' },
    { label: 'Active Programs', value: 12, description: 'Currently running initiatives' },
    { label: 'Students Enrolled', value: '1,450', description: 'Across all madaris' },
    { label: 'Pending Approvals', value: 3, description: 'Awaiting review' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Madaris Dashboard</h2>
        <p className="text-muted-foreground">
          High-level overview of madaris performance and engagement.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-lg">{stat.label}</CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Highlights</CardTitle>
          <CardDescription>Key updates from the madaris network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground">Curriculum Review Completed</h3>
            <p className="text-sm text-muted-foreground">
              Three madaris finalized their updated curriculum for the upcoming academic year.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">New Partnership Opportunities</h3>
            <p className="text-sm text-muted-foreground">
              Outreach teams established two new partnerships focused on digital literacy programs.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Upcoming Training Sessions</h3>
            <p className="text-sm text-muted-foreground">
              Teacher training workshops are scheduled for next month with 45 educators registered.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MadarisDashboard;

