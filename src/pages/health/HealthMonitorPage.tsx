import { useEffect, useState } from 'react';
import { Activity, Heart, Footprints, Flame, Search, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area,
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAllUsers } from '../../api/users';
import { getMetricsByUser } from '../../api/metrics';
import type { User, HealthMetrics } from '../../types';

const INTEGRATIONS = [
  { name: 'Apple Health',  status: 'connected', color: 'badge-green'  },
  { name: 'Google Fit',    status: 'connected', color: 'badge-green'  },
  { name: 'Fitbit',        status: 'connected', color: 'badge-green'  },
  { name: 'Samsung Health',status: 'syncing',   color: 'badge-amber'  },
  { name: 'Garmin',        status: 'connected', color: 'badge-green'  },
  { name: 'Polar',         status: 'pending',   color: 'badge-slate'  },
];

export default function HealthMonitorPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [metrics, setMetrics] = useState<HealthMetrics[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllUsers().then(data => setUsers(data.filter(u => u.role === 'Consumer'))).catch(() => null);
  }, []);

  const loadMetrics = async (uid: string) => {
    setLoadingMetrics(true);
    try {
      const data = await getMetricsByUser(uid);
      setMetrics(data.slice(-30));
    } catch { setMetrics([]); }
    finally { setLoadingMetrics(false); }
  };

  const handleSelect = (uid: string) => { setSelectedId(uid); loadMetrics(uid); };

  const chartData = metrics.map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: m.weight,
    calories: m.caloriesConsumed,
    steps: m.steps,
  }));

  const latest = metrics[metrics.length - 1];
  const filteredUsers = users.filter(u => (u.fullName || u.email).toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="Health Monitor" subtitle="User health metrics and device integrations">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* User List */}
        <div className="card flex flex-col gap-3">
          <div className="text-sm font-semibold text-slate-700">Consumers</div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 text-sm" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
            {filteredUsers.map(u => (
              <button
                key={u._id}
                onClick={() => handleSelect(u._id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors ${selectedId === u._id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(u.fullName || u.email).charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{u.fullName || u.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Panel */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          {selectedId && latest ? (
            <>
              {/* Latest Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Weight',   value: `${latest.weight ?? '—'} kg`, icon: Activity, color: '#3b82f6'  },
                  { label: 'Calories', value: `${latest.caloriesConsumed ?? '—'}`,    icon: Flame,      color: '#f59e0b'  },
                  { label: 'Steps',    value: (latest.steps ?? 0).toLocaleString(),   icon: Footprints,  color: '#10b981'  },
                  { label: 'Heart',    value: 'Synced',                                icon: Heart,      color: '#ef4444'  },
                ].map(s => (
                  <div key={s.label} className="card flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}18` }}>
                      <s.icon size={16} style={{ color: s.color }} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900">{s.value}</div>
                      <div className="text-[11px] text-slate-400">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              {loadingMetrics ? (
                <div className="card animate-pulse h-48" />
              ) : chartData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card">
                    <div className="text-sm font-semibold text-slate-800 mb-3">Weight Trend</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={false} name="Weight (kg)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card">
                    <div className="text-sm font-semibold text-slate-800 mb-3">Daily Steps</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                        <defs>
                          <linearGradient id="gSteps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        <Area type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2} fill="url(#gSteps)" dot={false} name="Steps" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-10 text-slate-400">No health metrics recorded yet</div>
              )}
            </>
          ) : (
            <div className="card flex flex-col items-center justify-center py-16 text-slate-400">
              <Activity size={36} className="mb-3 text-slate-300" />
              <p className="text-sm">Select a user to view their health metrics</p>
            </div>
          )}

          {/* Device Integrations */}
          <div className="card">
            <div className="text-sm font-semibold text-slate-800 mb-3">Connected Devices & Integrations</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INTEGRATIONS.map(d => (
                <div key={d.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className={d.status === 'connected' ? 'text-emerald-500' : 'text-slate-300'} />
                    <span className="text-sm font-medium text-slate-700">{d.name}</span>
                  </div>
                  <span className={d.color}>{d.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
