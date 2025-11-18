import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';

const SafeCityDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Safe City Projects', value: 15, description: 'Active surveillance projects' },
    { label: 'Total Cameras', value: '2,450', description: 'Across all projects' },
    { label: 'Active Cameras', value: '2,180', description: 'Currently operational' },
    { label: 'Coverage Areas', value: 8, description: 'Cities with active monitoring' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Safe City Dashboard</h2>
        <p className="text-muted-foreground">
          High-level overview of Safe City surveillance and monitoring systems.
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
          <CardDescription>Key updates from the Safe City network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground">New Camera Installations</h3>
            <p className="text-sm text-muted-foreground">
              Three new surveillance zones have been activated with 120 cameras installed this month.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">System Upgrades Completed</h3>
            <p className="text-sm text-muted-foreground">
              Facial recognition capabilities have been enhanced across five major districts.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Maintenance Schedule</h3>
            <p className="text-sm text-muted-foreground">
              Quarterly maintenance checks are scheduled for next week covering 450 camera units.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafeCityDashboard;

