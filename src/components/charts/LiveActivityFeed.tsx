import { Dumbbell, Utensils, Target, Zap, Heart } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'workout' | 'meal' | 'goal' | 'ai' | 'health';
}

const MOCK_FEED: ActivityItem[] = [
  { id: '1', user: 'Marcus Chen',   action: 'completed HIIT workout',              time: '2s ago',  type: 'workout' },
  { id: '2', user: 'Layla Hassan',  action: 'logged 1,840 cal · meal plan',        time: '14s ago', type: 'meal'    },
  { id: '3', user: 'James Park',    action: 'hit 10,000 step goal',                time: '41s ago', type: 'goal'    },
  { id: '4', user: 'Sofia Reyes',   action: 'received AI workout recommendation',  time: '1m ago',  type: 'ai'      },
  { id: '5', user: 'Ethan Brooks',  action: 'synced Apple Health data',            time: '2m ago',  type: 'health'  },
  { id: '6', user: 'Aisha Nwosu',   action: 'started strength training session',   time: '3m ago',  type: 'workout' },
  { id: '7', user: 'Carlos Moreno', action: 'completed nutrition goal for today',  time: '4m ago',  type: 'meal'    },
];

const TYPE_CONFIG = {
  workout: { icon: Dumbbell,  bg: 'bg-orange-100',  fg: 'text-orange-500'  },
  meal:    { icon: Utensils,  bg: 'bg-emerald-100', fg: 'text-emerald-500' },
  goal:    { icon: Target,    bg: 'bg-blue-100',    fg: 'text-blue-500'    },
  ai:      { icon: Zap,       bg: 'bg-purple-100',  fg: 'text-purple-500'  },
  health:  { icon: Heart,     bg: 'bg-red-100',     fg: 'text-red-400'     },
};

export default function LiveActivityFeed() {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-slate-800">Live Activity</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-600">LIVE</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {MOCK_FEED.map((item) => {
          const { icon: Icon, bg, fg } = TYPE_CONFIG[item.type];
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                <Icon size={14} className={fg} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-emerald-600">{item.user}</span>
                <span className="text-sm text-slate-500"> {item.action}</span>
              </div>
              <span className="text-[11px] text-slate-400 flex-shrink-0">{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
