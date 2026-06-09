import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface GoalSlice {
  name: string;
  value: number;
  color: string;
}

const DEFAULT_DATA: GoalSlice[] = [
  { name: 'Fitness',    value: 38, color: '#f59e0b' },
  { name: 'Nutrition',  value: 28, color: '#10b981' },
  { name: 'Mental',     value: 14, color: '#8b5cf6' },
  { name: 'Sleep',      value: 12, color: '#f8fafc' },
  { name: 'Hydration',  value: 8,  color: '#3b82f6' },
];

interface Props {
  data?: GoalSlice[];
  totalUsers?: number;
}

export default function GoalDonutChart({ data = DEFAULT_DATA, totalUsers }: Props) {
  return (
    <div className="card flex flex-col gap-3 h-full">
      <div>
        <div className="text-base font-semibold text-slate-800">Goal Distribution</div>
        <div className="text-xs text-slate-400">Active user goals by domain</div>
      </div>

      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-shrink-0" style={{ width: 130, height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={42} outerRadius={62}
                paddingAngle={2}
                dataKey="value"
                startAngle={90} endAngle={-270}
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 10, fontSize: 12, border: '1px solid #e2e8f0' }}
                formatter={(v) => [`${v}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-slate-900">{totalUsers ? `${(totalUsers / 1000).toFixed(0)}K` : '248K'}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">USERS</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-600">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-slate-700">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
