import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  sparkData?: { v: number }[];
  icon: LucideIcon;
  iconColor?: string;
  chartColor?: string;
}

export default function StatCard({
  label,
  value,
  change,
  sparkData,
  icon: Icon,
  iconColor = '#10b981',
  chartColor = '#10b981',
}: StatCardProps) {
  const positive = (change ?? 0) >= 0;

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
            {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {positive ? '+' : ''}{change}%
          </div>
        )}
      </div>

      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
        <div className="text-2xl font-bold text-slate-900 leading-none">{value}</div>
      </div>

      {sparkData && sparkData.length > 0 && (
        <div className="h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#spark-${label})`}
                dot={false}
                isAnimationActive
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
