import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/UI/card';

const IntelligenceCycleDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Records', value: 0, description: 'Intelligence cycle records' },
    { label: 'Alerts Received', value: 0, description: 'Total alerts processed' },
    { label: 'Alerts Disposed', value: 0, description: 'Successfully handled' },
    { label: 'False Alerts', value: 0, description: 'Deducted false alerts' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Intelligence Cycle Dashboard</h2>
        <p className="text-muted-foreground">
          High-level overview of intelligence cycle performance and metrics.
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
          <CardDescription>Key updates from the intelligence cycle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground">Intelligence Processing</h3>
            <p className="text-sm text-muted-foreground">
              Monitoring and analysis of intelligence data for actionable insights.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Alert Management</h3>
            <p className="text-sm text-muted-foreground">
              Efficient processing and disposal of alerts with continuous improvement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligenceCycleDashboard;

