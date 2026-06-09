import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line, RadialBarChart, RadialBar, Legend,
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const userGrowth = MONTHS.map((month, i) => ({
  month,
  new: Math.round(180 + i * 22 + Math.random() * 30),
  active: Math.round(140 + i * 18 + Math.random() * 20),
  churned: Math.round(10 + Math.random() * 15),
}));

const calorieData = MONTHS.map((month, i) => ({
  month,
  consumed: Math.round(1800 + Math.sin(i) * 200 + Math.random() * 100),
  burned: Math.round(1600 + Math.sin(i * 0.8) * 150 + Math.random() * 80),
}));

const goalCompletion = [
  { name: 'Completed', value: 68, fill: '#10b981' },
  { name: 'Active',    value: 22, fill: '#3b82f6' },
  { name: 'Failed',    value: 10, fill: '#f87171' },
];

const workoutsByIntensity = [
  { name: 'Low',    sessions: 42 },
  { name: 'Medium', sessions: 89 },
  { name: 'High',   sessions: 56 },
];

const stepTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  steps: Math.round(6000 + Math.sin(i * 0.5) * 2000 + Math.random() * 1500),
}));

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="card flex flex-col gap-4">
      <div>
        <div className="text-base font-semibold text-slate-800">{title}</div>
        {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout title="Analytics" subtitle="Platform performance metrics and trends">

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Avg. Daily Steps',    value: '8,240',  sub: '+12% vs last week',  color: 'text-emerald-600' },
          { label: 'Goal Completion',     value: '68%',    sub: 'of all active goals', color: 'text-blue-600'   },
          { label: 'Avg. Calories/Day',   value: '1,843',  sub: 'consumed',            color: 'text-amber-600'  },
          { label: 'Workout Freq/User',   value: '3.2x',   sub: 'per week',            color: 'text-violet-600' },
        ].map(k => (
          <div key={k.label} className="card">
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-xs font-medium text-slate-700 mt-1">{k.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <ChartCard title="User Growth" subtitle="New vs Active vs Churned · monthly">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowth} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="new" stroke="#10b981" strokeWidth={2} fill="url(#gNew)" dot={false} name="New" />
              <Area type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} fill="url(#gActive)" dot={false} name="Active" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Calorie Trends" subtitle="Consumed vs burned · monthly average">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={calorieData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="consumed" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Consumed" />
              <Bar dataKey="burned" fill="#10b981" radius={[4, 4, 0, 0]} name="Burned" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Step Trends" subtitle="30-day rolling average">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stepTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey="steps" stroke="#14b8a6" strokeWidth={2} dot={false} name="Steps" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Goal Completion Rate" subtitle="Across all user goals">
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart innerRadius="40%" outerRadius="90%" data={goalCompletion} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={6} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Workouts by Intensity" subtitle="Session distribution">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={workoutsByIntensity} layout="vertical" margin={{ top: 5, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="sessions" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
