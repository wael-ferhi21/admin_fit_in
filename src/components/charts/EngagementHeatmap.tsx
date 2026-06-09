import { useMemo } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKS = 17;

function randomIntensity() {
  const r = Math.random();
  if (r < 0.15) return 0;
  if (r < 0.35) return 1;
  if (r < 0.60) return 2;
  if (r < 0.80) return 3;
  return 4;
}

const INTENSITY_CLASSES = [
  'bg-slate-100',
  'bg-emerald-200',
  'bg-emerald-300',
  'bg-emerald-400',
  'bg-emerald-500',
];

export default function EngagementHeatmap() {
  const grid = useMemo(() => {
    return Array.from({ length: WEEKS }, () =>
      Array.from({ length: 7 }, () => randomIntensity())
    );
  }, []);

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-slate-800">Engagement Heatmap</div>
          <div className="text-xs text-slate-400">Daily active sessions · {WEEKS} weeks</div>
        </div>
        <span className="badge-green text-xs">UP 12.4%</span>
      </div>

      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] pt-0.5 justify-around">
          {DAYS.map(d => (
            <span key={d} className="text-[10px] text-slate-400 w-6 leading-[14px]">{d}</span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] flex-1 overflow-hidden">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px] flex-1">
              {week.map((intensity, di) => (
                <div
                  key={di}
                  className={`rounded-[3px] aspect-square ${INTENSITY_CLASSES[intensity]}`}
                  title={`Intensity: ${intensity}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 justify-end mt-1">
        <span className="text-[10px] text-slate-400">Less</span>
        {INTENSITY_CLASSES.map((cls, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span className="text-[10px] text-slate-400">More</span>
      </div>
    </div>
  );
}
