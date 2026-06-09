import { useEffect, useState } from 'react';
import { Users, Sparkles, Target } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import ActivityAreaChart from '../../components/charts/ActivityAreaChart';
import GoalDonutChart from '../../components/charts/GoalDonutChart';
import EngagementHeatmap from '../../components/charts/EngagementHeatmap';
import LiveActivityFeed from '../../components/charts/LiveActivityFeed';
import { getStats } from '../../api/users';
import type { DashboardStats } from '../../types';

function buildSparkline(base: number, trend: 'up' | 'down' | 'volatile') {
  return Array.from({ length: 12 }, (_, i) => {
    const delta = trend === 'up' ? i * 2 : trend === 'down' ? -i : (Math.random() - 0.5) * 10;
    return { v: Math.max(0, base + delta + (Math.random() - 0.5) * 5) };
  });
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Active Users',
      value: loading ? '—' : stats?.activeUsers.toLocaleString() ?? '0',
      change: 12.4,
      icon: Users,
      iconColor: '#10b981',
      chartColor: '#10b981',
      sparkData: buildSparkline(200, 'up'),
    },
    {
      label: 'Total Consumers',
      value: loading ? '—' : stats?.consumers.toLocaleString() ?? '0',
      change: 8.2,
      icon: Users,
      iconColor: '#3b82f6',
      chartColor: '#3b82f6',
      sparkData: buildSparkline(150, 'up'),
    },
    {
      label: 'AI Sessions',
      value: loading ? '—' : `${((stats?.totalUsers ?? 0) * 12.8 / 1000).toFixed(1)}K`,
      change: 28.7,
      icon: Sparkles,
      iconColor: '#8b5cf6',
      chartColor: '#8b5cf6',
      sparkData: buildSparkline(120, 'up'),
    },
    {
      label: 'Avg. Adherence',
      value: '84.2%',
      change: -2.1,
      icon: Target,
      iconColor: '#f59e0b',
      chartColor: '#f59e0b',
      sparkData: buildSparkline(80, 'volatile'),
    },
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle="Real-time pulse of the FIT-IN ecosystem">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <div className="xl:col-span-2">
          <ActivityAreaChart data={[]} title="User Growth & Sessions" subtitle="Last 12 months · cumulative" />
        </div>
        <GoalDonutChart totalUsers={stats?.totalUsers} />
      </div>

      {/* Coaches Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[
          { label: 'Total Users',    value: loading ? '—' : stats?.totalUsers.toLocaleString() ?? '0',  color: 'text-slate-900' },
          { label: 'Coaches',        value: loading ? '—' : stats?.coaches ?? '0',                       color: 'text-violet-600' },
          { label: 'Admins',         value: loading ? '—' : stats?.admins ?? '0',                        color: 'text-blue-600'   },
          { label: 'Platform Health', value: '99.94%',                                                   color: 'text-emerald-600' },
        ].map((item) => (
          <div key={item.label} className="card text-center">
            <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-slate-400 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <EngagementHeatmap />
        <LiveActivityFeed />
      </div>
    </DashboardLayout>
  );
}
