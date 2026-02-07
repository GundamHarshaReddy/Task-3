'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Stats = {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  high_priority: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/tickets/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Helpdesk & Workflow Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Internal Support System
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/tickets">
                <Button variant="outline">View All Tickets</Button>
              </Link>
              <Link href="/tickets/new">
                <Button>Create New Ticket</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Dashboard Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Tickets</CardDescription>
                <CardTitle className="text-3xl">{stats?.total || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardDescription>Open</CardDescription>
                <CardTitle className="text-3xl text-blue-600">
                  {stats?.open || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-3">
                <CardDescription>In Progress</CardDescription>
                <CardTitle className="text-3xl text-amber-600">
                  {stats?.in_progress || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardDescription>Resolved</CardDescription>
                <CardTitle className="text-3xl text-green-600">
                  {stats?.resolved || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-slate-500">
              <CardHeader className="pb-3">
                <CardDescription>Closed</CardDescription>
                <CardTitle className="text-3xl text-slate-600">
                  {stats?.closed || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardDescription>High Priority</CardDescription>
                <CardTitle className="text-3xl text-red-600">
                  {stats?.high_priority || 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage tickets and workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/tickets/new" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Create New Ticket
                </Button>
              </Link>
              <Link href="/tickets?status=open" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View Open Tickets
                </Button>
              </Link>
              <Link href="/tickets?status=in_progress" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View In Progress
                </Button>
              </Link>
              <Link href="/tickets?priority=high" className="block">
                <Button variant="outline" className="w-full justify-start">
                  View High Priority
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current operational metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Active Tickets</span>
                <span className="text-sm font-semibold text-slate-900">
                  {(stats?.open || 0) + (stats?.in_progress || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  Resolution Rate
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {stats?.total
                    ? Math.round(
                        ((stats.resolved + stats.closed) / stats.total) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  Tickets Requiring Attention
                </span>
                <span className="text-sm font-semibold text-red-600">
                  {stats?.high_priority || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
