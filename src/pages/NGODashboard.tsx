import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';

const NGODashboard: React.FC = () => {
  const stats = [
    { label: 'Total NGOs', value: 0, description: 'Registered organizations' },
    { label: 'Active Programs', value: 0, description: 'Currently running initiatives' },
    { label: 'Health Sector', value: 0, description: 'NGOs in health field' },
    { label: 'Education Sector', value: 0, description: 'NGOs in education field' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">NGOs Dashboard</h2>
        <p className="text-muted-foreground">
          High-level overview of NGOs performance and engagement.
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
          <CardDescription>Key updates from the NGOs network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground">New NGO Registrations</h3>
            <p className="text-sm text-muted-foreground">
              Several new NGOs have been registered in the system.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Program Updates</h3>
            <p className="text-sm text-muted-foreground">
              Various NGOs are actively running programs in health and education sectors.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGODashboard;

