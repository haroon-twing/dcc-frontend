import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';

const IllegalSpectrumDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Extortion Cases', value: 0, description: 'Recorded incidents' },
    { label: 'Active Investigations', value: 0, description: 'Ongoing cases' },
    { label: 'Cases Resolved', value: 0, description: 'Completed investigations' },
    { label: 'Multi-Agency Operations', value: 0, description: 'Collaborative efforts' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Illegal Spectrum Dashboard</h2>
        <p className="text-muted-foreground">
          High-level overview of illegal spectrum activities and enforcement actions.
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
          <CardDescription>Key updates from illegal spectrum monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground">Monitoring Activities</h3>
            <p className="text-sm text-muted-foreground">
              System is ready to track and manage extortion cases and related activities.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IllegalSpectrumDashboard;

