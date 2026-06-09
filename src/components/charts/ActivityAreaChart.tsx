import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

interface DataPoint {
  month: string;
  users: number;
  sessions: number;
}

interface Props {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function generateMockData(): DataPoint[] {
  return MONTHS.map((month, i) => ({
    month,
    users:    Math.round(120 + i * 18 + Math.random() * 20),
    sessions: Math.round(80 + i * 12 + Math.random() * 15),
  }));
}

export default function ActivityAreaChart({ data, title = 'User Activity', subtitle = 'Last 12 months' }: Props) {
  const chartData = data.length ? data : generateMockData();

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-slate-800">{title}</div>
          <div className="text-xs text-slate-400">{subtitle}</div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Users</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block" />Sessions</span>
        </div>
      </div>

      <div className="flex items-end gap-6 mb-2">
        <div>
          <div className="text-2xl font-bold text-slate-900">{chartData[chartData.length - 1]?.users ?? 0}</div>
          <div className="text-xs text-slate-400">Active Users</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">{chartData[chartData.length - 1]?.sessions ?? 0}</div>
          <div className="text-xs text-slate-400">Sessions</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            labelStyle={{ fontWeight: 600, color: '#1e293b' }}
          />
          <Legend wrapperStyle={{ display: 'none' }} />
          <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2.5} fill="url(#gradUsers)" dot={false} />
          <Area type="monotone" dataKey="sessions" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradSessions)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
