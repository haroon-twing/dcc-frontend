import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI/card';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    closedLeads: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leadsRes, usersRes] = await Promise.all([
          api.get('/leads'),
          api.get('/users')
        ]);
        
        const leads = leadsRes.data?.data || [];
        const users = usersRes.data?.data || [];
        
        setStats({
          totalLeads: leads.length,
          activeLeads: leads.filter((lead: any) => !lead.status.includes('closed')).length,
          closedLeads: leads.filter((lead: any) => lead.status.includes('closed')).length,
          totalUsers: users.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user?.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalLeads}
          </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.activeLeads}
          </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Closed Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
            {stats.closedLeads}
          </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
            {stats.totalUsers}
          </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/leads" 
            className="block p-4 bg-gray-50 dark:bg-card/50 rounded-lg border border-gray-200 dark:border-border text-center hover:bg-gray-100 dark:hover:bg-card transition-all duration-200 hover:shadow-md dark:hover:shadow-purple-900/20"
          >
            <h4 className="font-medium text-gray-900 dark:text-foreground mb-2">📋 Manage Leads</h4>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">View and manage all leads</p>
          </Link>

          <Link 
            to="/users" 
            className="block p-4 bg-gray-50 dark:bg-card/50 rounded-lg border border-gray-200 dark:border-border text-center hover:bg-gray-100 dark:hover:bg-card transition-all duration-200 hover:shadow-md dark:hover:shadow-purple-900/20"
          >
            <h4 className="font-medium text-gray-900 dark:text-foreground mb-2">👥 Manage Users</h4>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">View and manage users</p>
          </Link>

          <Link 
            to="/departments" 
            className="block p-4 bg-gray-50 dark:bg-card/50 rounded-lg border border-gray-200 dark:border-border text-center hover:bg-gray-100 dark:hover:bg-card transition-all duration-200 hover:shadow-md dark:hover:shadow-purple-900/20"
          >
            <h4 className="font-medium text-gray-900 dark:text-foreground mb-2">🏢 Departments</h4>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">Manage departments</p>
          </Link>

          <Link 
            to="/roles" 
            className="block p-4 bg-gray-50 dark:bg-card/50 rounded-lg border border-gray-200 dark:border-border text-center hover:bg-gray-100 dark:hover:bg-card transition-all duration-200 hover:shadow-md dark:hover:shadow-purple-900/20"
          >
            <h4 className="font-medium text-gray-900 dark:text-foreground mb-2">🔐 Roles & Permissions</h4>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">Manage roles and permissions</p>
          </Link>
        </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;