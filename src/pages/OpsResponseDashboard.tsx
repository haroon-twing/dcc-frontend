import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';

const OpsResponseDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Operations', value: 45, description: 'Active operations' },
    { label: 'Leads Identified', value: 120, description: 'Total leads from IBO' },
    { label: 'Terrorists Apprehended', value: 28, description: 'Successfully apprehended' },
    { label: 'Pending Cases', value: 15, description: 'Awaiting court decisions' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Ops & Response Dashboard</h2>
        <p className="text-muted-foreground">
          High-level overview of operations and response activities.
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
          <CardDescription>Key updates from operations and response activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground">IBO Operations Completed</h3>
            <p className="text-sm text-muted-foreground">
              Three intelligence-based operations were successfully conducted this month.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Feedback Mechanisms Active</h3>
            <p className="text-sm text-muted-foreground">
              Response development feedback mechanisms are operational and receiving inputs.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Court Proceedings</h3>
            <p className="text-sm text-muted-foreground">
              Multiple cases are progressing through the judicial system with positive outcomes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpsResponseDashboard;

